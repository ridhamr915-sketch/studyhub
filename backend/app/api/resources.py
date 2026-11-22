import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import FileResponse
from app.core.config import settings
from app.schemas.models import ResourceResponse, ResourceUpdate
from app.services.pdf_service import pdf_service
from app.db.local_store import local_store
from app.db.supabase_client import get_supabase_client

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".doc", ".docx", ".ppt", ".pptx", ".md"}
MAX_FILE_SIZE = 25 * 1024 * 1024 # 25 MB

@router.get("", response_model=List[ResourceResponse])
def get_resources(
    subject_id: Optional[str] = Query(None),
    file_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    bookmarked: Optional[bool] = Query(None)
):
    resources = local_store.get_resources()
    
    if subject_id:
        resources = [r for r in resources if r.get("subject_id") == subject_id]
    if file_type:
        resources = [r for r in resources if r.get("file_type", "").lower() == file_type.lower()]
    if bookmarked is not None:
        resources = [r for r in resources if r.get("is_bookmarked") == bookmarked]
    if search:
        s = search.lower()
        resources = [
            r for r in resources
            if s in r.get("title", "").lower() 
            or s in r.get("file_name", "").lower() 
            or any(s in tag.lower() for tag in r.get("tags", []))
        ]
        
    return resources

@router.post("/upload", response_model=ResourceResponse)
async def upload_resource(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    subject_id: Optional[str] = Form(None),
    unit_id: Optional[str] = Form(None),
    tags: Optional[str] = Form("") # comma-separated tags
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, TXT, DOC, DOCX, PPT, PPTX."
        )

    # Read file contents and validate size
    contents = await file.read()
    file_size = len(contents)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 25MB.")

    # Save to disk
    safe_filename = f"{os.urandom(4).hex()}_{file.filename}"
    file_dest = os.path.join(settings.UPLOAD_DIR, safe_filename)
    with open(file_dest, "wb") as f:
        f.write(contents)

    # Extract text content
    extraction = pdf_service.extract_text(contents, file_name=file.filename)
    extracted_text = extraction.get("text", "")

    # Parse tags
    tag_list = [t.strip() for t in tags.split(",") if t.strip()] if tags else []

    # Upload to Supabase Storage if configured
    supabase = get_supabase_client()
    supabase_path = safe_filename
    if supabase:
        try:
            supabase.storage.from_(settings.STORAGE_BUCKET).upload(
                file=contents,
                path=safe_filename,
                file_options={"content-type": file.content_type or "application/octet-stream"}
            )
        except Exception:
            pass

    resource_title = title.strip() if title else os.path.splitext(file.filename)[0]
    raw_type = ext.replace(".", "")

    new_res = local_store.add_resource({
        "title": resource_title,
        "subject_id": subject_id,
        "unit_id": unit_id,
        "file_name": file.filename,
        "file_path": file_dest,
        "file_type": raw_type,
        "file_size": file_size,
        "extracted_text": extracted_text,
        "tags": tag_list
    })

    return new_res

@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: str):
    res = local_store.get_resource(resource_id)
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    return res

@router.get("/{resource_id}/download")
def download_resource(resource_id: str):
    res = local_store.get_resource(resource_id)
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    file_path = res.get("file_path", "")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Physical file missing on server storage")

    media_type = "application/pdf" if res.get("file_type") == "pdf" else "application/octet-stream"
    return FileResponse(
        path=file_path,
        filename=res.get("file_name", "download"),
        media_type=media_type
    )

@router.put("/{resource_id}", response_model=ResourceResponse)
def update_resource(resource_id: str, payload: ResourceUpdate):
    data = payload.model_dump(exclude_unset=True) if hasattr(payload, 'model_dump') else payload.dict(exclude_unset=True)
    updated = local_store.update_resource(resource_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Resource not found")
    return updated

@router.delete("/{resource_id}")
def delete_resource(resource_id: str):
    res = local_store.get_resource(resource_id)
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    # Delete local file
    file_path = res.get("file_path", "")
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass

    # Delete Supabase file
    supabase = get_supabase_client()
    if supabase:
        try:
            safe_name = os.path.basename(file_path)
            supabase.storage.from_(settings.STORAGE_BUCKET).remove([safe_name])
        except Exception:
            pass

    local_store.delete_resource(resource_id)
    return {"message": "Resource deleted successfully"}

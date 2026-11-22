import logging
from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger("studyhub.supabase")

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
        
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
    
    if url and key and url != "https://your-project-id.supabase.co":
        try:
            _supabase_client = create_client(url, key)
            logger.info("Supabase client initialized successfully.")
            return _supabase_client
        except Exception as e:
            logger.warning(f"Failed to initialize Supabase client: {e}")
            return None
    return None

def is_supabase_configured() -> bool:
    return get_supabase_client() is not None

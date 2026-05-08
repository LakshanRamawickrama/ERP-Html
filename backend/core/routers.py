class NoDatabaseRouter:
    """
    A router to control all database operations on models in the
    auth, admin, sessions, and messages applications.
    """
    def db_for_read(self, model, **hints):
        return None

    def db_for_write(self, model, **hints):
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in ['auth', 'admin', 'sessions', 'messages']:
            return False
        return True

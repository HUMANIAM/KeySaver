from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models import db  # Now imports from models package
from utils.email import mail
from routes.auth import auth_bp
from routes.keys import keys_bp


def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config["FRONTEND_URL"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(keys_bp)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'KeySaver API is running'}), 200
    
    # Root endpoint
    @app.route('/')
    def index():
        return jsonify({
            'name': 'KeySaver API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'keys': '/api/keys',
                'health': '/health'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app


if __name__ == '__main__':
    app = create_app()
    # SECURITY: debug should ONLY be True in development
    # For production, use a WSGI server like gunicorn
    import os
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)

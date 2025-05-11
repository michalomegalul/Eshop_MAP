# Flask Backend Security Fixes

## 1. JWT Cookie Security

```python
# Change this:
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_SAMESITE"] = "None"

# To this:
app.config["JWT_COOKIE_SECURE"] = True  # Required for HTTPS
app.config["JWT_COOKIE_SAMESITE"] = "None"  # Only if cross-origin with Secure=True
```

## 2. CORS Configuration

```python
# Change this:
CORS(app, origins=["http://localhost:5173", "http://localhost:8000", "http://157.245.25.143:8000"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

# To this:
CORS(app, origins=[
    "http://localhost:5173", 
    "http://localhost:8000",
    "https://dobsinskym.com",
    "https://www.dobsinskym.com"
], supports_credentials=True,
   allow_headers=["Content-Type", "Authorization", "X-CSRF-TOKEN"], 
   methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])
```

## 3. Add Environment-Based Configuration

```python
# Add this near the top:
is_production = os.environ.get('FLASK_ENV') != 'development'

# Then update:
app.config["JWT_COOKIE_SECURE"] = is_production
app.config["JWT_COOKIE_SAMESITE"] = "None" if is_production else "Lax"
```

## 4. Fix for the Refresh Endpoint

Make sure your `/refresh` endpoint accepts GET requests, since your frontend is making GET requests to it:

```python
@api_bp.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh_token():
    # Get the JWT identity
    current_user = get_jwt_identity()
    
    # Create new access token
    new_token = create_access_token(identity=current_user)
    
    # Set the JWT access cookie
    resp = jsonify({'refresh': True})
    set_access_cookies(resp, new_token)
    
    return resp
```

# Example /refresh endpoint for your views.py

from flask import jsonify
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    create_access_token,
    set_access_cookies
)

@api_bp.route('/refresh', methods=['GET'])
@jwt_required(refresh=True)
def refresh_token():
    """
    Endpoint for refreshing access tokens. Must be accessed with a valid refresh token.
    Returns a new access token in a cookie if the refresh token is valid.
    """
    # Get the identity from the refresh token
    current_user = get_jwt_identity()
    
    # Create a new access token
    access_token = create_access_token(identity=current_user)
    
    # Create the response
    response = jsonify({'refresh': True, 'status': 'success'})
    
    # Set the JWT access cookie in the response
    set_access_cookies(response, access_token)
    
    return response

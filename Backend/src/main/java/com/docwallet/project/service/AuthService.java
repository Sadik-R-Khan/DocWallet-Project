package com.docwallet.project.service;

import com.docwallet.project.dto.AuthRequest;
import com.docwallet.project.dto.AuthResponse;

public interface AuthService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
}

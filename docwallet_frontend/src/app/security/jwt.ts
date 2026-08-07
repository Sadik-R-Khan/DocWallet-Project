import { HttpInterceptorFn } from "@angular/common/http";

export const jwtInterceptor : HttpInterceptorFn = (req, next)=>{
    //1. grab the token form local storage
    const token = localStorage.getItem('jwt_token');
    
    //if the token exists clone the req and attach teh authorization header
    if(token){
        const clonedReq = req.clone({
            setHeaders:{
                Authorization : `Bearer ${token}`
            }
        });
        //return modified request
        return next(clonedReq);
    }
    // when there is no token(user trying to login) send the request as is
    return next(req);
}
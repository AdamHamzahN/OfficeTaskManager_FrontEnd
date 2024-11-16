export class JwtToken{
    static jwtDecode(str?: any) {
        const base64 = str?.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        return JSON.parse(decoded);
    }

    static storeToken(authData:any){
        if( typeof window !== 'undefined') {
            localStorage.setItem('auth', JSON.stringify(authData));
        }
    }

    static getAuthData(){
        let authData;
        if( typeof window !== 'undefined') {
            const storedData = localStorage.getItem('auth');
            if( storedData ){
              authData = JSON.parse(storedData); //mengambil data auth dari localStorage
            }
          }
        return authData;
    }

    static getPayload(){
        let payload;
        const authData = JwtToken.getAuthData() || null;
        const token = authData?.token || null;
        if (token && token !== null) {
            const parts = token?.split('.');
            payload = JwtToken.jwtDecode(parts ? parts[1] : null);
          }
        return payload;
    }
}
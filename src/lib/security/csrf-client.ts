export const CSRF_COOKIE = 'sn_csrf';
export function readCookie(name:string){
  if (typeof document==='undefined') return '';
  const c = document.cookie.split('; ').find(x=>x.startsWith(name+'='))?.split('=')[1] || '';
  try { return decodeURIComponent(c); } catch { return c; }
}
export function csrfHeader(){
  const token = readCookie(CSRF_COOKIE);
  return token ? { 'X-CSRF-Token': token } : {};
}


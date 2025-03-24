// Response基类
export interface ApiResponse<T = any> {
    status: string;
    data: T;
    message: string;
  }
 
 /* 数据接口 */

 // 请求Token数据类型
 export interface Token {
   isHr: boolean;
   token: string;
 }
 export interface TokenResponse extends ApiResponse<Token> {}

 // 备注数据类型
 export interface Note {
    note: string;
 }
 export interface NoteTextResponse extends ApiResponse<Note> {} 

 // 密码验证数据类型
 export interface Pwd{
  roomName: string;
 }
 export interface PwdResponse extends ApiResponse<Pwd> {}

 
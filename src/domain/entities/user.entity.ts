export interface User {
  uuid: string;
  name: string;
  email: string;
  photo_url: string;
  partner_id: string;
  created_at?: Date;
  updated_at?: Date;
}

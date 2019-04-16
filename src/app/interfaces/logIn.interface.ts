export interface logIn_Interface {
  logged: boolean;
  expired?: boolean;
  token?: string;
  user?: string;
  fCreated?: string;
  fRecicled?: string;
  fExpired?: string;
  sessionTime?: number;
  remainSession?: number;
}

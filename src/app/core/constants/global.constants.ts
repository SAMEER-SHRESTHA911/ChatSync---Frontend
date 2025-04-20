interface ILoggedInUser {
  id: string | null;
  isCheckedIn: boolean;
}

export const loggedInUser: ILoggedInUser = {
  id: localStorage.getItem('userId'),
  isCheckedIn: false,
};

export function getRole(): string | null {
  return localStorage.getItem('role');
}

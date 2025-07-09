import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Role {
  id: number;
  name: "ROLE_ADMIN" | "ROLE_TEACHER" | "ROLE_SUPER_TEACHER" | "ROLE_STUDENT";
}

interface UserData {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  governorate: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  educationLevel: string; 
}

interface UserState {
  userData: UserData | null;
}

const initialState: UserState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;

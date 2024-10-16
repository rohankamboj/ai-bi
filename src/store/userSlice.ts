// src/store/userSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique session IDs
import Cookies from 'js-cookie';
import queryString from 'query-string'; // Import query-string

interface ApiKey {
  name: string;
  key: string;
  visible: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface Agent {
  agent_name: string;
  id: string;
  template: string;
  url: string;
  image: string;
  description: string;
  agent_type: string;
  autonomous_type: 'image_to_json' | 'pdf_to_json' | 'json_to_neo4j';
}

interface Organization {
  id: string;
  name: string;
}

interface Role {
  org_id: string;
  role: string;
}

interface UserInvitation {
  email: string;
  role_id: string;
  org_id: string;
  accepted: boolean;
}

export interface User {
  username: string;
  email: string;
  plan: string;
  image: string;
  tokens_used: number;
  plugins: string[];
  organizations: Organization[];
  roles: Role[];
  api_keys: ApiKey[];
  agents: Agent[];
  created_at: string;
  updated_at: string;
  id: string;
  invitations: UserInvitation[];
  integrations: string[];
}

interface UserState {
  token: string | undefined | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  sessionId: string | null;
}

const initialState: UserState = {
  token: Cookies.get('token'),
  user: null,
  loading: false,
  error: null,
  sessionId: localStorage.getItem('sessionId'),
};

const RAPID_AUTH_URL = import.meta.env.VITE_RAPID_AUTH_URL;

// loginUser thunk
export const loginUser = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: string }
>('user/loginUser', async ({ username, password }, { rejectWithValue }) => {
  try {
    const url = 'https://aibi-backend-1060627628276.us-central1.run.app/token';
    const data = { username, password };

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: queryString.stringify(data),
      url,
    };

    const response = await axios(options);
    const { access_token, user_id } = response.data;

    Cookies.set('token', access_token, { secure: true, expires: 1 });
    localStorage.setItem('userId', user_id);

    return access_token;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

// fetchUserDetails thunk
export const fetchUserDetails = createAsyncThunk<
  User,
  void,
  { state: { user: UserState }; rejectValue: string }
>('user/fetchUserDetails', async (_, { getState, rejectWithValue }) => {
  const token = getState().user.token;
  if (!token) {
    return rejectWithValue('No token found');
  }
  try {
    const response = await axios.get(`${RAPID_AUTH_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch user details'
      );
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      Cookies.set('token', action.payload, { secure: true, expires: 1 });
      const sessionId = uuidv4();
      state.sessionId = sessionId;
      localStorage.setItem('sessionId', sessionId);
    },
    clearUser: (state) => {
      state.token = null;
      state.user = null;
      state.sessionId = null;
      Cookies.remove('token');
      // localStorage.removeItem('token');
      // localStorage.removeItem('sessionId');
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        Cookies.set('token', action.payload, { secure: true, expires: 1 });
        const sessionId = uuidv4();
        state.sessionId = sessionId;
        localStorage.setItem('sessionId', sessionId);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserDetails.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user details';
      });
  },
});

export const { setToken, clearUser } = userSlice.actions;

export default userSlice.reducer;

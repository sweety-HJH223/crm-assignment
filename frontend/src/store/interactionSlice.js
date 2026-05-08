import { createSlice } from '@reduxjs/toolkit';

const interactionSlice = createSlice({
  name: 'interaction',
  initialState: {
    interactions: [],
    currentInteraction: null,
    loading: false,
    error: null,
  },
  reducers: {
    setInteractions: (state, action) => {
      state.interactions = action.payload;
    },
    setCurrentInteraction: (state, action) => {
      state.currentInteraction = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addInteraction: (state, action) => {
      state.interactions.push(action.payload);
    },
    updateInteraction: (state, action) => {
      const index = state.interactions.findIndex(i => i.id === action.payload.id);
      if (index !== -1) state.interactions[index] = action.payload;
    },
  },
});

export const {
  setInteractions,
  setCurrentInteraction,
  setLoading,
  setError,
  addInteraction,
  updateInteraction,
} = interactionSlice.actions;

export default interactionSlice.reducer;
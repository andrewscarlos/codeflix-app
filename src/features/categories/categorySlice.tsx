import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Result, Results } from "../../types/Category";
import { apiSlice } from "../api/apiSlice";

export interface Category {
  id: string;
  name: string;
  deleted_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  description?: string;
}

const endpointUrl: string = "/categories";

function deleteCategoryMutation(category: Category) {
  return {
    url: `${endpointUrl}/${category.id}`,
    method: "DELETE",
  };
}
export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query: query, mutation: mutation }) => ({
    getCategories: query<Category[], void>({
      query: () => `${endpointUrl}`,
      providesTags: ["Categories"],
    }),
    deleteCategory: mutation<Result, { id: string }>({
      query: deleteCategoryMutation,
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const initialState: Category[] = [
  {
    id: "foo1",
    name: "foo1",
    deleted_at: "null",
    is_active: true,
    created_at: "",
    updated_at: "",
    description: "zar",
  },
  {
    id: "foo2",
    name: "foo2",
    deleted_at: "null",
    is_active: false,
    created_at: "",
    updated_at: "",
    description: "zar",
  },
  {
    id: "foo3",
    name: "foo3",
    deleted_at: "null",
    is_active: false,
    created_at: "",
    updated_at: "",
    description: "zar",
  },
  {
    id: "foo4",
    name: "foo4",
    deleted_at: "null",
    is_active: true,
    created_at: "",
    updated_at: "",
    description: "zar",
  },
];

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    createCategory: (state, action) => {
      state.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.findIndex(
        (category) => category.name === action.payload.id
      );
      state[index] = action.payload;
    },
    deleteCategory: (state, action) => {
      const index = state.findIndex(
        (category) => category.name === action.payload.id
      );
      state.splice(index, 1);
    },
  },
});

//Selectores

export const selectorCategories = (state: RootState) => state.categories;

export const selectCategoriesById = (state: RootState, id: string) => {
  const category = state.categories.find((categories) => categories.id === id);
  return (
    category || {
      id: "",
      name: "",
      description: "",
      is_active: false,
      deleted_at: "null",
      created_at: "",
      updated_at: "",
    }
  );
};

export default categoriesSlice.reducer;
export const { createCategory, deleteCategory, updateCategory } =
  categoriesSlice.actions;

export const { useGetCategoriesQuery, useDeleteCategoryMutation } =
  categoriesApiSlice;

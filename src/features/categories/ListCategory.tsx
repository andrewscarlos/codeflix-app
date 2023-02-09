import { Typography, Box, Button, IconButton } from "@mui/material";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "./categorySlice";
import { Link } from "react-router-dom";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

export const CategoryList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isFetching, error } = useGetCategoriesQuery();
  const [deleteCategory, deleteCategoryStatus] = useDeleteCategoryMutation();
  console.log('data', data)
  const rows: GridRowsProp = data
    ? data.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        isActive: category.is_active,
        createdAt: new Date(category.created_at).toLocaleDateString("pt-BR"),
      }))
    : [];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: renderNameCell,
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 1,
      type: "boolean",
      renderCell: rederIsActiveCell,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "id",
      headerName: "Actions",
      type: "string",
      flex: 1,
      renderCell: renderActionsCell,
    },
  ];
  async function handleDeleteCategory(id: string) {
    await deleteCategory({ id });
  }
  useEffect(() => {
    if (deleteCategoryStatus.isSuccess) {
      enqueueSnackbar("Success delete category", { variant: "warning" });
    }

    if (deleteCategoryStatus.error) {
      enqueueSnackbar("Success delete category", { variant: "error" });
    }
  }, [deleteCategoryStatus, enqueueSnackbar]);
  function renderActionsCell(rowData: GridRenderCellParams) {
    return (
      <IconButton
        color="secondary"
        onClick={() => handleDeleteCategory(rowData.value)}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    );
  }

  function renderNameCell(rowData: GridRenderCellParams) {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/categories/edit/${rowData.id}`}
      >
        <Typography color="primary">{rowData.value}</Typography>
      </Link>
    );
  }

  function rederIsActiveCell(rowData: GridRenderCellParams) {
    return (
      <Typography color={rowData.value ? "primary" : "secondary"}>
        {rowData.value ? "Active" : "Inactive"}
      </Typography>
    );
  }
  return (
    <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/categories/create"
          style={{ marginBottom: "1rem" }}
        >
          New Category
        </Button>
      </Box>
      Categoriry List Page
      <Box sx={{ display: "flex", height: 600 }}>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMS: 500 },
            },
          }}
          disableColumnSelector={true}
          disableColumnFilter={true}
          disableDensitySelector={true}
          //checkboxSelection={true}
          disableSelectionOnClick={true}
          components={{ Toolbar: GridToolbar }}
          rows={rows}
          columns={columns}
        ></DataGrid>
      </Box>
    </Box>
  );
};

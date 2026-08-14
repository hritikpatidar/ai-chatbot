import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../../service/Client/productServices";

const useProducts = ({
  clientId,
  page = 1,
  limit = 10,
  status = "",
} = {}) => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: [
      "clientProducts",
      clientId,
      page,
      limit,
      status,
    ],

    queryFn: async () => {
      const response = await getProductsService(clientId, {
        page,
        limit,
        status,
      });

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message ||
            "Failed to fetch products",
        );
      }

      return response?.data?.data;
    },

    enabled: Boolean(clientId),

    placeholderData: (previousData) => previousData,

    staleTime: 30 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: ({ clientId, data }) => {
      return createProductService(clientId, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientProducts", clientId],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, data }) => {
      return updateProductService(productId, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientProducts", clientId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId) => {
      return deleteProductService(productId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientProducts", clientId],
      });
    },
  });

  return {
    // Query
    products: productsQuery.data?.products || [],
    pagination: {
      total: productsQuery.data?.total || 0,
      page: productsQuery.data?.page || page,
      limit: productsQuery.data?.limit || limit,
      totalPages: productsQuery.data?.totalPages || 0,
    },

    isLoading: productsQuery.isLoading,
    isFetching: productsQuery.isFetching,
    error: productsQuery.error,

    refetch: productsQuery.refetch,

    // Mutations
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,

    createLoading: createMutation.isPending,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,

    mutationLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

export default useProducts;
export default (
  filter: any,
  order: any,
  limit: any,
  offset: any,
  getData: any
) => {
  const { onResult, loading, refetch, onError } = useQuery(
    getData,
    () => ({
      offset: offset && offset.value,
      limit: limit && limit.value,
      order: order.value,
      filter: filter.value,
    }),
    () => ({
      fetchPolicy: "network-only",
    })
  );

  return {
    onResult,
    loading,
    refetch,
    onError,
  };
};

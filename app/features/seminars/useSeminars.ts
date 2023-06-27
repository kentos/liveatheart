function useSeminars(id?: string) {
  const data = [];
  // const { data } = useQuery({
  //   initialData: [] as Seminar[],
  //   queryKey: ['seminars'],
  //   queryFn: async () => {
  //     const result = await api.get<Seminar[]>('/seminars');
  //     return result.data;
  //   },
  // });

  return { data, seminar: data?.find((d) => d._id === id) };
}

export default useSeminars;

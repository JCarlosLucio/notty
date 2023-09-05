import { Cross2Icon } from "@radix-ui/react-icons";
import { type GetServerSideProps } from "next";

import CreateList from "@/components/CreateList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { session } };
};

const Dashboard = () => {
  const { data: lists } = api.list.getAll.useQuery();

  const { toast } = useToast();
  const ctx = api.useContext();

  const { mutate: deleteList } = api.list.delete.useMutation({
    onSuccess: (deletedListId) => {
      ctx.list.getAll.setData(undefined, (oldList) => {
        return oldList && deletedListId
          ? oldList.filter((list) => list.id !== deletedListId)
          : oldList;
      });
      toast({
        description: "Your list was deleted.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    },
  });

  return (
    <main className="min-h-screen pt-16">
      <CreateList />

      <div>
        <p>The lists {lists?.length}</p>
        {lists?.map((list) => (
          <p key={list.id}>
            {list.title}
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteList({ id: list.id })}
            >
              <Cross2Icon />
            </Button>
          </p>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;

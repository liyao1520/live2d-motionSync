import { Button } from "antd";
import { Outlet } from "react-router";

export default function Index() {
  return (
    <div className="size-full">
      <div className="flex gap-[20px] justify-center">
        <Button type="link" href={import.meta.env.BASE_URL + "/"}>
          audio demo
        </Button>

        <Button
          type="link"
          onClick={() => {
            console.log(import.meta.env.BASE_URL + "/#stream");
            location.href = import.meta.env.BASE_URL + "/#stream";
            setTimeout(() => {
              location.reload();
            }, 15);
          }}
        >
          audio stream demo
        </Button>
      </div>
      <Outlet />
    </div>
  );
}

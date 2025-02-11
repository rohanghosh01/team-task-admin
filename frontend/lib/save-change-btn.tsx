import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Props {
  setOpen: (open: boolean) => void;
  setInput: (input: string) => void;
  handleSave: () => void;
}

const SaveChangeButtonComponent = ({
  handleSave,
  setOpen,
  setInput,
}: Props) => {
  const [showDiv, setShowDiv] = useState(false);

  useEffect(() => {
    // Set a delay of 2 seconds (2000 milliseconds)
    const timer = setTimeout(() => {
      setShowDiv(true); // Set state to true after the delay
    }, 200); // 2000 ms delay

    // Cleanup the timer if the component is unmounted before the timeout
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showDiv && (
        <div className="flex gap-2 p-3 bg-background">
          <Button
            onClick={handleSave}
            className="bg-blue-400 hover:bg-blue-500  h-8"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              // setInput("");
            }}
            className="h-8"
            variant="ghost"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};
export default SaveChangeButtonComponent;

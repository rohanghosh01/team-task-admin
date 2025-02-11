import { Input } from "./ui/input";
import { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";

interface PasswordBtnProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PasswordBtn = ({ label, ...props }: PasswordBtnProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex relative">
      <Input {...props} type={show ? "text" : "password"} />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-2"
      >
        {show ? <EyeOff /> : <EyeIcon />}
      </button>
    </div>
  );
};

export default PasswordBtn;

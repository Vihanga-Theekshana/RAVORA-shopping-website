import toast from "react-hot-toast";

const baseClassName =
  "rounded-2xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg";

export const notifySuccess = (message) =>
  toast.success(message, {
    className: baseClassName,
  });

export const notifyError = (message) =>
  toast.error(message, {
    className: `${baseClassName} bg-red-600`,
  });

export const notifyInfo = (message) =>
  toast(message, {
    icon: "i",
    className: `${baseClassName} bg-slate-700`,
  });

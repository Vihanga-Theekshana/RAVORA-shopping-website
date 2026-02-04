const Login = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="border-2 border-black w-1/3 h-120 m-6">
        <div className="flex flex-col m-3">
          <label>Full Name</label>
          <input
            type="text"
            className="border-2 border-black p-1"
            placeholder="Jhon Doe"
          ></input>
        </div>
      </div>
    </div>
  );
};
export default Login;

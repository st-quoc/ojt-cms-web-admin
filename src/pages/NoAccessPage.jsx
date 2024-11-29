import { useNavigate } from 'react-router-dom';

const NoAccessPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToAdmin = () => {
    navigate('/admin');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-lg">
        <h1 className="text-4xl font-bold text-red-600">403</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-800">
          Access Denied
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Sorry, you do not have permission to view this page. Please contact
          your administrator if you believe this is an error.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 text-white bg-gray-500 hover:bg-gray-600 rounded-lg shadow-md transition duration-200"
          >
            Quay lại
          </button>
          <button
            onClick={handleGoToAdmin}
            className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition duration-200"
          >
            Admin
          </button>
          <button
            onClick={handleGoToHome}
            className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition duration-200"
          >
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoAccessPage;

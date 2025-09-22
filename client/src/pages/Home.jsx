import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Courses",
      description: "Explore and register for classes offered at our studio, varying from music to dance.",
      buttonText: "Browse Courses",
      route: "/courses",
      image: "/danceClass.jpg"
    },
    {
      title: "Rooms",
      description: "Book studio rooms for your own practice, teaching, or events.",
      buttonText: "Book a Room",
      route: "/rooms",
      image: "/room.jpg"
    }
  ];

//   return (
//       <div className="bg-gray-100 min-h-screen py-12 px-4">
//       {/* Welcome Section */}
//       <div className="text-center max-w-3xl mx-auto mb-12">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">
//           Welcome to Move n Muse!
//         </h1>
//         <p className="text-gray-600 text-lg">
//           Teaching dance and music to all ages and offering a variety of rooms for hire!
//         </p>
//       </div>

//       {/* Feature Sections */}
//       <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
//         {sections.map((section, index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition"
//             className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"

// //           >
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               {section.title}
//             </h2>
//             <p className="text-gray-600 mb-4">{section.description}</p>

//             {/* 👇 Image section */}
//             <img
//               src={section.image}
//               alt={section.title}
//               className="mb-4 rounded-md w-full h-40 object-cover"
//             />

//             <button
//               onClick={() => navigate(section.route)}
//               className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//             >
//               {section.buttonText}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;


  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      {/* Top Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Move n Muse!</h1>
        <p className="text-gray-600 text-lg">
          Teaching dance and music to all ages and offering a variety of rooms for hire!
        </p>
      </div>

      {/* Feature Grid: Courses & Rooms */}
<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
  {sections.map((section, index) => (
    <div
      key={index}
      className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full"
    >
      <img src={section.image} alt={section.title} className="w-full h-48 object-cover" />
      <div className="flex flex-col justify-between flex-grow p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
          <p className="text-gray-600 mb-6 min-h-[72px]">{section.description}</p>
        </div>
        <button
          onClick={() => navigate(section.route)}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mt-auto"
        >
          {section.buttonText}
        </button>
      </div>
    </div>
  ))}
</div>


      {/* Account Button */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/account")}
          className="bg-gray-800 text-white py-3 px-6 rounded-lg text-lg hover:bg-gray-700 transition"
        >
          View Account & Bookings
        </button>
      </div>
    </div>
  );
};

export default Home;
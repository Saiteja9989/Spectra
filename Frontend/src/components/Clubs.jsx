// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Card, Typography } from 'antd';
// import { ClusterOutlined } from '@ant-design/icons';
// import Swal from 'sweetalert2'; // Import SweetAlert

// const { Meta } = Card;
// const { Title } = Typography;

// const ProfilePage = () => {

//   // Function to handle click on "Clubs" option
//   const handleClubsClick = () => {
//     Swal.fire({
//       icon: 'info',
//       title: 'Club Details',
//       text: 'Club details will be updated soon.',
//     });
//   };

//   return (
//     <div>
//       <Title level={4}>Options</Title>
//       {/* Add onClick event to trigger the handleClubsClick function */}
//       <Link to="/clubs" onClick={handleClubsClick}>
//         <Card hoverable className="option-card">
//           <Meta title="Clubs" avatar={<ClusterOutlined />} />
//         </Card>
//       </Link>
//     </div>
//   );
// };

// export default ProfilePage;

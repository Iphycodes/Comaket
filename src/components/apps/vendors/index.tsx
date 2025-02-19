// import { Avatar, Badge, Input, Rate, Select, Tag } from 'antd';
// import { MapPin, MessageCircle, Search, Share2 } from 'lucide-react';
// import Link from 'next/link';
import React from 'react';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import { mockVendors } from '@grc/_shared/constant';
import ComingSoon from '../market/lib/side-panel/lib/coming-soon';
// import { AppContext } from '@grc/app-context';
// import { Notification } from 'iconsax-react';

// interface Vendor {
//   id: string;
//   name: string;
//   avatar: string;
//   description: string;
//   address: string;
//   categories: string[];
//   rating: number;
//   totalLikes: number;
//   joinedDate: string;
// }

interface VendorsProps {}

// const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Books', 'Food'];

const Vendors = ({}: VendorsProps) => {
  // const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // const router = useRouter();

  // const filteredVendors = vendors.filter((vendor) => {
  //   const matchesSearch =
  //     vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesCategories =
  //     selectedCategories.length === 0 ||
  //     vendor.categories.some((cat) => selectedCategories.includes(cat));
  //   return matchesSearch && matchesCategories;
  // });

  // const handleChat = (e: React.MouseEvent, vendorId: string) => {
  //   e.stopPropagation(); // Prevent card click event
  //   console.log('Chat with vendor:', vendorId);
  // };

  // const handleShare = (e: React.MouseEvent, vendorId: string) => {
  //   e.stopPropagation(); // Prevent card click event
  //   console.log('Share vendor:', vendorId);
  // };

  // const handleVendorClick = (vendorId: string) => {
  //   router.push(`/vendor/${vendorId}`);
  // };

  // const { setToggleNotificationsDrawer } = useContext(AppContext);

  return (
    // <div className="min-h-screen dark:bg-gray-900">
    //   {/* Fixed Header and Search Section */}
    //   <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-6">
    //     <div className="max-w-7xl mx-auto px-6">
    //       <div className="pt-6">
    //         <h1 className="text-3xl font-bold dark:text-white mb-1">Discover Vendors</h1>
    //         <p className="text-gray-600 dark:text-gray-300 mb-2">
    //           Find and connect with trusted vendors in our marketplace
    //         </p>
    //       </div>

    //       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
    //         <div className="flex flex-col md:flex-row gap-4">
    //           <div className="flex-1">
    //             <Input
    //               prefix={<Search className="text-gray-400" size={20} />}
    //               placeholder="Search vendors by name or description"
    //               className="w-full"
    //               size="large"
    //               onChange={(e) => setSearchQuery(e.target.value)}
    //             />
    //           </div>
    //           <div className="w-full md:w-80">
    //             <Select
    //               mode="multiple"
    //               placeholder="Filter by category"
    //               className="w-full"
    //               size="large"
    //               onChange={setSelectedCategories}
    //               options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Scrollable Vendors Section */}
    //   <div className="max-w-7xl mx-auto px-6 pb-6">
    //     <div className="grid grid-cols-1 gap-6">
    //       {filteredVendors.map((vendor, index) => (
    //         <motion.div
    //           key={vendor.id}
    //           initial={{ opacity: 0, y: 20 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.3, delay: index * 0.1 }}
    //           onClick={() => handleVendorClick(vendor.id)}
    //           className="cursor-pointer"
    //         >
    //           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
    //             <div className="flex flex-col md:flex-row gap-6">
    //               <div className="flex-shrink-0">
    //                 <Avatar src={vendor.avatar} size={120} />
    //               </div>

    //               <div className="flex-1">
    //                 <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-2">
    //                   <Link
    //                     href={`/vendor/${vendor.id}`}
    //                     className="text-2xl font-bold dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    //                     onClick={(e) => e.stopPropagation()}
    //                   >
    //                     {vendor.name}
    //                   </Link>
    //                   <div className="flex gap-2">
    //                     <button
    //                       onClick={(e) => handleChat(e, vendor.id)}
    //                       className="flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue text-white rounded-lg transition-colors"
    //                     >
    //                       <MessageCircle size={20} />
    //                       Chat Vendor
    //                     </button>
    //                     <button
    //                       onClick={(e) => handleShare(e, vendor.id)}
    //                       className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    //                       title="Share Profile"
    //                     >
    //                       <Share2 size={20} className="text-gray-600 dark:text-gray-300" />
    //                     </button>
    //                   </div>
    //                 </div>

    //                 <p className="text-gray-600 max-w-[500px] dark:text-gray-300 mb-4 line-clamp-2">
    //                   {vendor.description}
    //                 </p>

    //                 <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
    //                   <MapPin size={16} />
    //                   {vendor.address}
    //                 </div>

    //                 <div className="flex flex-wrap gap-2">
    //                   {vendor.categories.map((category) => (
    //                     <Tag key={category} color="blue">
    //                       {category}
    //                     </Tag>
    //                   ))}
    //                 </div>
    //               </div>

    //               <div className="flex flex-col gap-2 md:text-right">
    //                 <div className="flex items-center gap-2 justify-end">
    //                   <Rate disabled defaultValue={vendor.rating} />
    //                   <span className="text-lg font-semibold dark:text-white">
    //                     {vendor.rating.toFixed(1)}
    //                   </span>
    //                 </div>
    //                 <div className="text-gray-500 dark:text-gray-400">
    //                   {vendor.totalLikes.toLocaleString()} likes
    //                 </div>
    //                 <div className="text-gray-500 dark:text-gray-400">
    //                   Member since {vendor.joinedDate}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </motion.div>
    //       ))}
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-[90vh] flex items-center bg-neutral-50 dark:bg-gray-900">
      <div className="mx-auto my-auto">
        <ComingSoon
          header={
            <div className="pt-6 text-center">
              <h1 className="text-3xl font-bold dark:text-white mb-1">Discover Vendors</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Find and connect with trusted vendors in our marketplace
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Vendors;

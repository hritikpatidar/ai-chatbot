// import React, { useMemo, useState } from "react";
// import { Controller, useForm } from "react-hook-form";

// import {
//   CreditCard,
//   Users,
//   TrendingUp,
//   DollarSign,
//   Search,
//   MoreVertical,
//   CheckCircle2,
//   XCircle,
//   Clock3,
//   Crown,
//   RefreshCw,
// } from "lucide-react";
// import CustomSelect from "../../components/common/CustomSelect";

// export default function AdminSubscriptions() {
//   const [search, setSearch] = useState("");

//   /* =========================================================
//      CUSTOM SELECT FORM
//   ========================================================= */

//   const {
//     control,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       status: "all",
//     },
//   });

//   const status = watch("status");

//   /* =========================================================
//      SUBSCRIPTIONS
//   ========================================================= */

//   const subscriptions = [
//     {
//       id: "SUB-1001",
//       client: "Fresh Basket",
//       email: "admin@freshbasket.com",
//       plan: "Professional",
//       amount: 49,
//       status: "active",
//       startDate: "12 Aug 2026",
//       nextBilling: "12 Sep 2026",
//     },
//     {
//       id: "SUB-1002",
//       client: "Tech Store",
//       email: "hello@techstore.com",
//       plan: "Starter",
//       amount: 19,
//       status: "active",
//       startDate: "10 Aug 2026",
//       nextBilling: "10 Sep 2026",
//     },
//     {
//       id: "SUB-1003",
//       client: "Fashion Hub",
//       email: "admin@fashionhub.com",
//       plan: "Enterprise",
//       amount: 99,
//       status: "active",
//       startDate: "08 Aug 2026",
//       nextBilling: "08 Sep 2026",
//     },
//     {
//       id: "SUB-1004",
//       client: "Smart Electronics",
//       email: "support@smartelectronics.com",
//       plan: "Professional",
//       amount: 49,
//       status: "cancelled",
//       startDate: "05 Jul 2026",
//       nextBilling: "-",
//     },
//     {
//       id: "SUB-1005",
//       client: "Green Mart",
//       email: "admin@greenmart.com",
//       plan: "Starter",
//       amount: 19,
//       status: "pending",
//       startDate: "18 Aug 2026",
//       nextBilling: "18 Sep 2026",
//     },
//   ];

//   /* =========================================================
//      FILTER
//   ========================================================= */

//   const filteredSubscriptions = useMemo(() => {
//     return subscriptions.filter((item) => {
//       const matchesSearch =
//         item.client.toLowerCase().includes(search.toLowerCase()) ||
//         item.email.toLowerCase().includes(search.toLowerCase()) ||
//         item.id.toLowerCase().includes(search.toLowerCase());

//       const matchesStatus = status === "all" || item.status === status;

//       return matchesSearch && matchesStatus;
//     });
//   }, [search, status]);

//   return (
//     <div className="min-h-full">
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
//             Subscriptions
//           </h1>

//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Monitor client subscriptions and platform revenue
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           <button
//             type="button"
//             // onClick={() => refetch()}
//             disabled={false}
//             className="
//               inline-flex
//               items-center
//               justify-center
//               gap-2
//               rounded-xl
//               border
//               border-gray-200
//               hover:border-gray-300
//               bg-white
//               px-4 py-2.5
//               text-sm
//               font-medium
//               text-gray-700
//               transition-all
//               hover:bg-gray-50
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//               dark:border-white/8
//               dark:bg-[#171b23]
//               dark:text-gray-300
//               dark:hover:bg-white/4
//               dark:hover:border-white/20
//             "
//           >
//             <RefreshCw size={16} className={false ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div
//         className="
//           mb-6
//           grid
//           grid-cols-1
//           gap-4
//           sm:grid-cols-2
//           xl:grid-cols-4
//         "
//       >
//         <SubscriptionStat
//           title="Total Subscriptions"
//           value="1,248"
//           change="+12.5%"
//           icon={<CreditCard size={20} />}
//         />

//         <SubscriptionStat
//           title="Active Subscriptions"
//           value="1,087"
//           change="+8.2%"
//           icon={<CheckCircle2 size={20} />}
//         />

//         <SubscriptionStat
//           title="Monthly Revenue"
//           value="£42,680"
//           change="+15.8%"
//           icon={<DollarSign size={20} />}
//         />

//         <SubscriptionStat
//           title="Total Clients"
//           value="1,156"
//           change="+10.4%"
//           icon={<Users size={20} />}
//         />
//       </div>

//       {/* =====================================================
//           PLANS
//       ===================================================== */}

//       <div
//         className="
//           mb-6
//           grid
//           grid-cols-1
//           gap-4
//           md:grid-cols-3
//         "
//       >
//         <PlanCard
//           title="Starter"
//           price="£19"
//           subscribers="438 subscribers"
//           icon={<CreditCard size={18} />}
//         />

//         <PlanCard
//           title="Professional"
//           price="£49"
//           subscribers="529 subscribers"
//           icon={<TrendingUp size={18} />}
//           popular
//         />

//         <PlanCard
//           title="Enterprise"
//           price="£99"
//           subscribers="120 subscribers"
//           icon={<Crown size={18} />}
//         />
//       </div>

//       {/* =====================================================
//           TABLE CARD
//       ===================================================== */}

//       <div
//         className="
//           rounded-2xl
//           border

//           border-gray-200
//           bg-white
//           shadow-sm

//           dark:border-white/10
//           dark:bg-[#11161f]
//         "
//       >
//         {/* ===================================================
//             TOOLBAR
//         =================================================== */}

//         <div
//           className="
//             flex
//             flex-col
//             gap-3
//             border-b
//             border-gray-200
//             p-4

//             sm:flex-row
//             sm:items-center
//             sm:justify-between

//             dark:border-white/10
//           "
//         >
//           {/* SEARCH */}

//           <div
//             className="
//               flex
//               h-10
//               w-full
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-gray-200
//               bg-gray-50
//               px-3

//               sm:max-w-sm

//               dark:border-white/10
//               dark:bg-white/3
//             "
//           >
//             <Search
//               size={16}
//               className="
//                 shrink-0
//                 text-gray-400
//               "
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search subscriptions..."
//               className="
//                 w-full
//                 bg-transparent
//                 text-sm
//                 text-gray-800
//                 outline-none
//                 placeholder:text-gray-400

//                 dark:text-white
//               "
//             />
//           </div>

//           {/* =================================================
//               CUSTOM STATUS SELECT
//           ================================================= */}

//           <div className="w-full sm:w-44">
//             <Controller
//               name="status"
//               control={control}
//               render={({ field }) => (
//                 <CustomSelect
//                   size="sm"
//                   name={field.name}
//                   value={field.value}
//                   onChange={field.onChange}
//                   options={[
//                     {
//                       value: "all",
//                       label: "All Status",
//                     },
//                     {
//                       value: "active",
//                       label: "Active",
//                     },
//                     {
//                       value: "pending",
//                       label: "Pending",
//                     },
//                     {
//                       value: "cancelled",
//                       label: "Cancelled",
//                     },
//                   ]}
//                   rounded="rounded-lg"
//                   error={errors.status?.message}
//                 />
//               )}
//             />
//           </div>
//         </div>

//         {/* ===================================================
//             DESKTOP TABLE
//         =================================================== */}

//         <div className="hidden overflow-x-auto md:block">
//           <table className="w-full">
//             <thead>
//               <tr
//                 className="
//                   border-b
//                   border-gray-200
//                   bg-gray-50

//                   dark:border-white/10
//                   dark:bg-white/2
//                 "
//               >
//                 <TableHead>Client</TableHead>
//                 <TableHead>Plan</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Start Date</TableHead>
//                 <TableHead>Next Billing</TableHead>
//                 <TableHead />
//               </tr>
//             </thead>

//             <tbody>
//               {filteredSubscriptions.map((item) => (
//                 <tr
//                   key={item.id}
//                   className="
//                       border-b
//                       border-gray-100
//                       transition
//                       hover:bg-gray-50

//                       dark:border-white/5
//                       dark:hover:bg-white/2
//                     "
//                 >
//                   {/* CLIENT */}

//                   <td className="px-4 py-4">
//                     <div>
//                       <p
//                         className="
//                             text-sm
//                             font-medium
//                             text-gray-900
//                             dark:text-white
//                           "
//                       >
//                         {item.client}
//                       </p>

//                       <p
//                         className="
//                             mt-0.5
//                             text-xs
//                             text-gray-500
//                             dark:text-gray-400
//                           "
//                       >
//                         {item.email}
//                       </p>

//                       <p
//                         className="
//                             mt-0.5
//                             text-[10px]
//                             text-gray-400
//                           "
//                       >
//                         {item.id}
//                       </p>
//                     </div>
//                   </td>

//                   {/* PLAN */}

//                   <td className="px-4 py-4">
//                     <span
//                       className="
//                           text-sm
//                           text-gray-700
//                           dark:text-gray-300
//                         "
//                     >
//                       {item.plan}
//                     </span>
//                   </td>

//                   {/* AMOUNT */}

//                   <td className="px-4 py-4">
//                     <span
//                       className="
//                           text-sm
//                           font-semibold
//                           text-gray-900
//                           dark:text-white
//                         "
//                     >
//                       £{item.amount}
//                     </span>

//                     <span
//                       className="
//                           text-xs
//                           text-gray-400
//                         "
//                     >
//                       /month
//                     </span>
//                   </td>

//                   {/* STATUS */}

//                   <td className="px-4 py-4">
//                     <StatusBadge status={item.status} />
//                   </td>

//                   {/* START DATE */}

//                   <td
//                     className="
//                         px-4
//                         py-4
//                         text-sm
//                         text-gray-500
//                         dark:text-gray-400
//                       "
//                   >
//                     {item.startDate}
//                   </td>

//                   {/* NEXT BILLING */}

//                   <td
//                     className="
//                         px-4
//                         py-4
//                         text-sm
//                         text-gray-500
//                         dark:text-gray-400
//                       "
//                   >
//                     {item.nextBilling}
//                   </td>

//                   {/* ACTION */}

//                   <td className="px-4 py-4">
//                     <button
//                       type="button"
//                       className="
//                           flex
//                           h-8
//                           w-8
//                           items-center
//                           justify-center
//                           rounded-lg
//                           text-gray-400
//                           transition

//                           hover:bg-gray-100

//                           dark:hover:bg-white/5
//                         "
//                     >
//                       <MoreVertical size={17} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {filteredSubscriptions.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="
//                       px-4
//                       py-12
//                       text-center
//                     "
//                   >
//                     <p
//                       className="
//                         text-sm
//                         text-gray-500
//                         dark:text-gray-400
//                       "
//                     >
//                       No subscriptions found.
//                     </p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ===================================================
//             MOBILE CARDS
//         =================================================== */}

//         <div
//           className="
//             divide-y
//             divide-gray-100
//             dark:divide-white/5
//             md:hidden
//           "
//         >
//           {filteredSubscriptions.map((item) => (
//             <div key={item.id} className="p-4">
//               <div
//                 className="
//                     flex
//                     items-start
//                     justify-between
//                     gap-3
//                   "
//               >
//                 <div>
//                   <p
//                     className="
//                         text-sm
//                         font-semibold
//                         text-gray-900
//                         dark:text-white
//                       "
//                   >
//                     {item.client}
//                   </p>

//                   <p
//                     className="
//                         mt-1
//                         text-xs
//                         text-gray-500
//                         dark:text-gray-400
//                       "
//                   >
//                     {item.email}
//                   </p>
//                 </div>

//                 <StatusBadge status={item.status} />
//               </div>

//               <div
//                 className="
//                     mt-4
//                     grid
//                     grid-cols-2
//                     gap-3
//                   "
//               >
//                 <MobileInfo label="Plan" value={item.plan} />

//                 <MobileInfo label="Amount" value={`£${item.amount}/month`} />

//                 <MobileInfo label="Start Date" value={item.startDate} />

//                 <MobileInfo label="Next Billing" value={item.nextBilling} />
//               </div>
//             </div>
//           ))}

//           {filteredSubscriptions.length === 0 && (
//             <div className="p-10 text-center">
//               <p
//                 className="
//                   text-sm
//                   text-gray-500
//                   dark:text-gray-400
//                 "
//               >
//                 No subscriptions found.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    SUBSCRIPTION STAT
// ========================================================= */

// const SubscriptionStat = ({ title, value, change, icon }) => {
//   return (
//     <div
//       className="
//         rounded-2xl
//         border
//         border-gray-200
//         bg-white
//         p-5
//         shadow-sm

//         dark:border-white/10
//         dark:bg-[#11161f]
//       "
//     >
//       <div className="flex items-start justify-between">
//         <div
//           className="
//             flex
//             h-10
//             w-10
//             items-center
//             justify-center
//             rounded-xl
//             bg-blue-50
//             text-blue-600

//             dark:bg-blue-500/10
//             dark:text-blue-400
//           "
//         >
//           {icon}
//         </div>

//         <span
//           className="
//             rounded-full
//             bg-green-50
//             px-2
//             py-1
//             text-[10px]
//             font-medium
//             text-green-600

//             dark:bg-green-500/10
//             dark:text-green-400
//           "
//         >
//           {change}
//         </span>
//       </div>

//       <p
//         className="
//           mt-4
//           text-xs
//           text-gray-500
//           dark:text-gray-400
//         "
//       >
//         {title}
//       </p>

//       <p
//         className="
//           mt-1
//           text-2xl
//           font-bold
//           text-gray-900
//           dark:text-white
//         "
//       >
//         {value}
//       </p>
//     </div>
//   );
// };

// /* =========================================================
//    PLAN CARD
// ========================================================= */

// const PlanCard = ({ title, price, subscribers, icon, popular = false }) => {
//   return (
//     <div
//       className="
//         relative
//         rounded-2xl
//         border
//         border-gray-200
//         bg-white
//         p-5
//         shadow-sm

//         dark:border-white/10
//         dark:bg-[#11161f]
//       "
//     >
//       {popular && (
//         <span
//           className="
//             absolute
//             right-4
//             top-4
//             rounded-full
//             bg-blue-50
//             px-2.5
//             py-1
//             text-[10px]
//             font-semibold
//             text-blue-600

//             dark:bg-blue-500/10
//             dark:text-blue-400
//           "
//         >
//           Popular
//         </span>
//       )}

//       <div className="flex items-center gap-3">
//         <div
//           className="
//             flex
//             h-9
//             w-9
//             items-center
//             justify-center
//             rounded-lg
//             bg-gray-100
//             text-gray-600

//             dark:bg-white/5
//             dark:text-gray-300
//           "
//         >
//           {icon}
//         </div>

//         <div>
//           <p
//             className="
//               text-sm
//               font-semibold
//               text-gray-900
//               dark:text-white
//             "
//           >
//             {title}
//           </p>

//           <p
//             className="
//               text-xs
//               text-gray-500
//               dark:text-gray-400
//             "
//           >
//             {subscribers}
//           </p>
//         </div>
//       </div>

//       <div className="mt-5">
//         <span
//           className="
//             text-2xl
//             font-bold
//             text-gray-900
//             dark:text-white
//           "
//         >
//           {price}
//         </span>

//         <span
//           className="
//             text-xs
//             text-gray-500
//             dark:text-gray-400
//           "
//         >
//           /month
//         </span>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    STATUS BADGE
// ========================================================= */

// const StatusBadge = ({ status }) => {
//   const config = {
//     active: {
//       text: "Active",
//       className:
//         "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
//       icon: <CheckCircle2 size={12} />,
//     },

//     pending: {
//       text: "Pending",
//       className:
//         "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
//       icon: <Clock3 size={12} />,
//     },

//     cancelled: {
//       text: "Cancelled",
//       className: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
//       icon: <XCircle size={12} />,
//     },
//   };

//   const item = config[status] || config.pending;

//   return (
//     <span
//       className={`
//         inline-flex
//         items-center
//         gap-1.5
//         rounded-full
//         px-2.5
//         py-1
//         text-[10px]
//         font-medium
//         ${item.className}
//       `}
//     >
//       {item.icon}

//       {item.text}
//     </span>
//   );
// };

// /* =========================================================
//    TABLE HEAD
// ========================================================= */

// const TableHead = ({ children }) => {
//   return (
//     <th
//       className="
//         whitespace-nowrap
//         px-4
//         py-3
//         text-left
//         text-[10px]
//         font-semibold
//         uppercase
//         tracking-wide
//         text-gray-500

//         dark:text-gray-400
//       "
//     >
//       {children}
//     </th>
//   );
// };

// /* =========================================================
//    MOBILE INFO
// ========================================================= */

// const MobileInfo = ({ label, value }) => {
//   return (
//     <div>
//       <p
//         className="
//           text-[10px]
//           uppercase
//           tracking-wide
//           text-gray-400
//         "
//       >
//         {label}
//       </p>

//       <p
//         className="
//           mt-1
//           text-xs
//           font-medium
//           text-gray-700
//           dark:text-gray-300
//         "
//       >
//         {value}
//       </p>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  CreditCard,
  Users,
  TrendingUp,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Crown,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import CustomSelect from "../../components/common/CustomSelect";
import { useAdminSubscriptions } from "../../hooks/Admin/useAdminSubscriptions";

// API amount is stored in minor currency units.
// Example: 999 GBP pence = £9.99
const formatCurrency = (amount = 0, currency = "gbp") => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Number(amount || 0) / 100);
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (value = 0) => Number(value || 0).toLocaleString("en-IN");

const formatMonthlyRevenue = (revenue = []) => {
  if (!revenue.length) return "£0.00";
  if (revenue.length === 1) {
    return formatCurrency(revenue[0].monthlyRevenue, revenue[0].currency);
  }

  return "Multiple currencies";
};

const SubscriptionStat = ({ title, value, change, icon }) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm

        dark:border-white/10
        dark:bg-[#11161f]
      "
    >
      <div className="flex items-start justify-between">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-blue-50
            text-blue-600

            dark:bg-blue-500/10
            dark:text-blue-400
          "
        >
          {icon}
        </div>
        {change && (
          <span
            className="
        rounded-full
        bg-green-50
        px-2
        py-1
        text-[10px]
        font-medium
        text-green-600
        
        dark:bg-green-500/10
        dark:text-green-400
        "
          >
            {change}
          </span>
        )}
      </div>

      <p
        className="
          mt-4
          text-xs
          text-gray-500
          dark:text-gray-400
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-2xl
          font-bold
          text-gray-900
          dark:text-white
        "
      >
        {value}
      </p>
    </div>
  );
};

const PlanCard = ({
  title,
  price,
  interval,
  subscribers,
  activeSubscribers,
  status,
  icon,
  popular = false,
}) => {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11161f]">
      {popular && (
        <span className="absolute right-4 top-4 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          Popular
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {subscribers}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {price}
        </span>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          /{interval === "year" ? "year" : "month"}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/10">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Active subscribers
        </span>

        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatNumber(activeSubscribers)}
        </span>
      </div>

      <div className="mt-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
            status === "active"
              ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
              : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
          }`}
        >
          {status === "active" ? "Available" : "Inactive"}
        </span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    active: {
      text: "Active",
      className:
        "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
      icon: <CheckCircle2 size={12} />,
    },

    trialing: {
      text: "Trialing",
      className:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      icon: <Clock3 size={12} />,
    },

    past_due: {
      text: "Past Due",
      className:
        "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      icon: <Clock3 size={12} />,
    },

    canceled: {
      text: "Canceled",
      className: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      icon: <XCircle size={12} />,
    },

    unpaid: {
      text: "Unpaid",
      className: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      icon: <XCircle size={12} />,
    },

    incomplete: {
      text: "Incomplete",
      className:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
      icon: <Clock3 size={12} />,
    },

    incomplete_expired: {
      text: "Incomplete Expired",
      className: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
      icon: <XCircle size={12} />,
    },

    paused: {
      text: "Paused",
      className:
        "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
      icon: <Clock3 size={12} />,
    },
  };

  const item = config[status] || config.incomplete;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${item.className}`}
    >
      {item.icon}
      {item.text}
    </span>
  );
};

const TableHead = ({ children }) => {
  return (
    <th
      className="
        whitespace-nowrap
        px-4
        py-3
        text-left
        text-[10px]
        font-semibold
        uppercase
        tracking-wide
        text-gray-500

        dark:text-gray-400
      "
    >
      {children}
    </th>
  );
};

const MobileInfo = ({ label, value }) => {
  return (
    <div>
      <p
        className="
          text-[10px]
          uppercase
          tracking-wide
          text-gray-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-xs
          font-medium
          text-gray-700
          dark:text-gray-300
        "
      >
        {value}
      </p>
    </div>
  );
};

export default function AdminSubscriptions() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "all",
    },
  });

  const status = watch("status");

  // React Query
  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminSubscriptions({
      search,
      status,
    });

  const stats = data?.data?.data?.stats || {};
  const plans = data?.data?.data?.plans || [];
  const subscriptions = data?.data?.data?.subscriptions || [];
  const hasData = Boolean(data);

  const statCards = [
    {
      title: "Total Subscriptions",
      value: formatNumber(stats.totalSubscriptions),
      icon: <CreditCard size={20} />,
    },
    {
      title: "Active Subscriptions",
      value: formatNumber(stats.activeSubscriptions),
      icon: <CheckCircle2 size={20} />,
    },
    {
      title: "Total Revenue",
      value: formatMonthlyRevenue(stats.monthlyRevenue),
      icon: <DollarSign size={20} />,
    },
    {
      title: "Total Clients",
      value: formatNumber(stats.totalClients),
      icon: <Users size={20} />,
    },
  ];

  return (
    <div className="min-h-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Subscriptions
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor client subscriptions and platform revenue
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#171b23] dark:text-gray-300 dark:hover:bg-white/5"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ERROR STATE */}
      {isError && !hasData && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
          <AlertCircle className="shrink-0 text-red-500" size={20} />

          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              Failed to load subscriptions
            </p>

            <p className="mt-1 text-xs text-red-500">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="ml-auto text-sm font-semibold text-red-600 dark:text-red-400"
          >
            Retry
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5"
              />
            ))
          : statCards.map((item) => (
              <SubscriptionStat
                key={item.title}
                title={item.title}
                value={item.value}
                change={item.change}
                icon={item.icon}
              />
            ))}
      </div>

      {/* PLAN OVERVIEW */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5"
              />
            ))
          : plans.map((plan) => (
              <PlanCard
                key={plan._id}
                title={plan.name}
                price={formatCurrency(plan.amount, plan.currency)}
                interval={plan.interval}
                subscribers={`${formatNumber(plan.totalSubscribers)} subscribers`}
                activeSubscribers={plan.activeSubscribers}
                status={plan.status}
                icon={
                  plan.sortOrder === 3 ? (
                    <Crown size={18} />
                  ) : plan.sortOrder === 2 ? (
                    <TrendingUp size={18} />
                  ) : (
                    <CreditCard size={18} />
                  )
                }
                popular={plan.sortOrder === 3}
              />
            ))}
      </div>

      {/* SUBSCRIPTIONS TABLE */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11161f]">
        {/* TOOLBAR */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          {/* SEARCH */}
          <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 sm:max-w-sm dark:border-white/10 dark:bg-white/5">
            <Search size={16} className="shrink-0 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client, email or subscription ID..."
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="w-full sm:w-52">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  size="sm"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "trialing", label: "Trialing" },
                    { value: "past_due", label: "Past Due" },
                    { value: "canceled", label: "Canceled" },
                    { value: "unpaid", label: "Unpaid" },
                    { value: "incomplete", label: "Incomplete" },
                    {
                      value: "incomplete_expired",
                      label: "Incomplete Expired",
                    },
                    { value: "paused", label: "Paused" },
                  ]}
                  rounded="rounded-lg"
                  error={errors.status?.message}
                />
              )}
            />
          </div>
        </div>

        {/* FETCHING INDICATOR */}
        {isFetching && !isLoading && (
          <div className="h-0.5 w-full overflow-hidden bg-blue-100 dark:bg-blue-500/10">
            <div className="h-full w-1/3 animate-pulse bg-blue-500" />
          </div>
        )}

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
                <TableHead>Client</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next Billing</TableHead>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-5">
                        <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : subscriptions.length > 0 ? (
                subscriptions.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    {/* CLIENT */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.client?.businessName ||
                          item.user?.fullName ||
                          "Unknown Client"}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {item.user?.email || item.client?.email || "—"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {item.stripeSubscriptionId}
                      </p>
                    </td>

                    {/* PLAN */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.plan?.name || "—"}
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.amount, item.currency)}
                      </span>

                      <span className="ml-1 text-xs text-gray-400">
                        /{item.interval === "year" ? "year" : "month"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* START DATE */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.currentPeriodStart || item.createdAt)}
                    </td>

                    {/* NEXT BILLING */}
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {item.status === "active" ||
                      (item.cancelAtPeriodEnd && item.currentPeriodEnd)
                        ? formatDate(item.currentPeriodEnd)
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No subscriptions found.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="divide-y divide-gray-100 dark:divide-white/5 md:hidden">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3 p-4">
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
              </div>
            ))
          ) : subscriptions.length > 0 ? (
            subscriptions.map((item) => (
              <div key={item._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {item.client?.businessName ||
                        item.user?.fullName ||
                        "Unknown Client"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {item.user?.email || item.client?.email || "—"}
                    </p>

                    <p className="mt-1 break-all text-[10px] text-gray-400">
                      {item.stripeSubscriptionId}
                    </p>
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <MobileInfo label="Plan" value={item.plan?.name || "—"} />

                  <MobileInfo
                    label="Amount"
                    value={`${formatCurrency(item.amount, item.currency)}/${item.interval === "year" ? "year" : "month"}`}
                  />

                  <MobileInfo
                    label="Start Date"
                    value={formatDate(
                      item.currentPeriodStart || item.createdAt,
                    )}
                  />

                  <MobileInfo
                    label="Next Billing"
                    value={
                      item.status === "active" ||
                      (item.cancelAtPeriodEnd && item.currentPeriodEnd)
                        ? formatDate(item.currentPeriodEnd)
                        : "—"
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No subscriptions found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

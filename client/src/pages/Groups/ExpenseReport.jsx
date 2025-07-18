import moment from "moment";
import Breadcrumb from "../../Components/BreadCrumb";
import PieGraph from "../../Components/Graph/PieChart";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UnorderedListOutlined, AreaChartOutlined } from "@ant-design/icons";
import getUserDetails from "../../GetData/UserDetails";
import axios from "axios";
import { CSVLink } from "react-csv";
import { Select, Modal, Table, DatePicker } from "antd";
const { RangePicker } = DatePicker;
// import Analytics from "./Analytics";

const ExpenseGroupReport = () => {
  const [expenseList, setExpense] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [allTransection, setAllTransection] = useState([]);
  const [viewData, setViewData] = useState("table");
  const [type, setType] = useState("all");
  const navigate = useNavigate();
  const { id } = useParams();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    // {
    //   title: "Settled",
    //   dataIndex: "isSettled",
    // },
  ];

  useEffect(() => {
    getUserDetails(setCurrentUser);
  }, []);

  const getAllTransactions = async () => {
    try {
      setLoading(true);
      console.log(type);
      const res = await axios.post(`/expense/getGroupExpenseByDate/${currentUser}`, {
        userid: id,
        frequency,
        selectedDate,
        type,
      });
      setLoading(false);
      setAllTransection(res.data);
      // console.log(res.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
      // message.error("Ftech Issue With Tranction");
    }
  };
  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type, currentUser]);

  const category = ["Weekly", "Monthly", "Yearly"];

  return (
    <div className="dark:bg-gray-900 dark:text-white md:relative md:float-right md:w-[90%] lg:relative lg:float-right lg:w-[90%]">
      <div className="dark:bg-gray-900 dark:text-white mt-4 flex flex-1 flex-col justify-end px-4 sm:px-6 lg:mx-auto lg:px-8 xl:max-w-6xl">
        <div>
          <Breadcrumb
            paths={[
              { name: "Groups", to: "/groups" },
              { name: "Group Detail", to: `/group/detail/${id}` },
              {
                name: "Expense Report",
                to: `/group/groupexpense/report/${id}`,
              },
            ]}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
              Expense Report
            </h2>
          </div>
          <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
            {/* <InputCategory
              values={category}
              onValueChange={(values) => setFrequency(values)}
            /> */}
            <Select
              value={frequency}
              onChange={(values) => setFrequency(values)}
            >
              <Select.Option value="7">Weekly</Select.Option>
              <Select.Option value="30">Monthly</Select.Option>
              <Select.Option value="365">Yearly</Select.Option>
              <Select.Option value="custom">custom</Select.Option>
            </Select>
            {frequency === "custom" && (
              <RangePicker
                value={selectedDate}
                onChange={(values) => setSelectedate(values)}
              />
            )}
          </div>
          <div className="switch-icons">
            <UnorderedListOutlined
              className={`mx-2 ${
                viewData === "table" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewData("table")}
            />
            <AreaChartOutlined
              className={`mx-2 ${
                viewData === "analytics" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewData("analytics")}
            />
          </div>
        </div>
        <div className="content">
          {viewData === "table" ? (
            <Table columns={columns} dataSource={allTransection} />
          ) : (
            <PieGraph currentUser={currentUser} />
          )}
        </div>
        <div className="mt-4 hidden flex-shrink-0 md:mt-0 md:ml-4 md:flex">
          <CSVLink
            data={allTransection}
            className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
            width="w-full"
          >
            Export
          </CSVLink>
        </div>
        {/* <div className="flex flex-shrink-0 md:mt-0 md:ml-4 md:hidden">
          <button
            className=" bg-blue-700 flex items-center justify-between cursor-pointer px-4 py-2 md:px-6 rounded font-medium active:ring-2 ring-brand-200 text-white bg-brand-600 hover:bg-brand-700"
            width="w-full"
            onClick={() => {
              setAddExpense(true);
            }}
          >
            <PlusCircleIcon className="w-5" />
          </button>
        </div> */}
        {/* {loading ? (
          <div className="flex items-center justify-center h-32">
            <BeatLoader />
          </div>
        ) : (
          <>
            {allTransection.length > 0 ? (
              <div className="mt-12 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Date Added
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Credit/Debit
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allTransection.map((group) => (
                      <tr key={group._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(group.date).toUTCString().slice(0, 17)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-10 flex h-52 w-full flex-col items-center justify-center border-2 border-dashed">
                <UserGroupIcon className="w-10 stroke-1" />
                <p className="mt-1 w-full text-center text-xl font-semibold sm:text-3xl">
                  No Expense to show
                </p>
                <p className="text-md mt-2 text-gray-600 sm:text-lg">
                  Add an Expense
                </p>
              </div>
            )} */}
        {/* </> */}
        {/* )} */}
      </div>
    </div>
  );
};

export default ExpenseGroupReport;

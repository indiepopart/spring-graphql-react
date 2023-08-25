import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CompanyTable from "./CompanyTable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CompanyApi, CompanyDTO } from "@/services/companies";
import Loader from "../loader/Loader";
import { useAsyncWithToken } from "@/app/hooks/useAsyncWithToken";

interface CompanyTableProperties {
  page?: number;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "companyNumber",
    headerName: "Company #",
    width: 100,
    sortable: false,
  },
  { field: "name", headerName: "Company Name", width: 250, sortable: false },
  { field: "category", headerName: "Category", width: 200, sortable: false },
  { field: "SIC", headerName: "SIC", width: 200, sortable: false },
  { field: "status", headerName: "Status", width: 100, sortable: false },
  { field: "owner", headerName: "Owner", width: 200, sortable: false },
];

const CompanyTableContainer = (props: CompanyTableProperties) => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathName = usePathname();
  const page = props.page ? props.page : 1;

  const {
    data: dataList,
    loading: loadingList,
    error: errorList,
  } = useAsyncWithToken(
    () => CompanyApi.getCompanyList({ page: page - 1}),
    [props.page]
  );

  const { data: dataCount } = useAsyncWithToken(
    () => CompanyApi.getCompanyCount(),
    []
  );

  const onPageChange = (pagination: GridPaginationModel) => {
    const params = new URLSearchParams(searchParams.toString());
    const page = pagination.page + 1;
    params.set("page", page.toString());
    router.push(pathName + "?" + params.toString());
  };


  const companyData = dataList?.map((company: CompanyDTO) => {
    return {
      id: company.id,
      name: company.name,
      category: company.category,
      companyNumber: company.companyNumber,
      SIC: company.SIC,
      status: company.status,
      owner: company.controlledBy.map((person) => person.name).join(", "),
    }
  });

  return (
    <>
      {loadingList && <Loader />}
      {errorList && <div>Error</div>}

      {!loadingList && dataList && (
        <CompanyTable
          pagination={{ page: page - 1, pageSize: 10 }}
          rowCount={dataCount}
          rows={companyData}
          columns={columns}
          onPageChange={onPageChange}
        ></CompanyTable>
      )}
    </>
  );
};

export default CompanyTableContainer;

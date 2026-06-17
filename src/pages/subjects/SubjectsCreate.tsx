import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";

const SubjectsCreate = () => {
  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Create New Subject</h1>
    </ListView>
  );
};

export default SubjectsCreate;

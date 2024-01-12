import { AppObject } from '@/_shared/namespace';
import { RoleNamespace } from '@/_shared/namespace/role';

export namespace EmployeeNamespace {
  export interface Employee extends AppObject {
    email_id: string;
    employee_id_: string;
    employee_name: string;
    employee_profile_pic: string;
    phone_number: number;
    is_active: boolean;
    create_date: Date;
    update_date: Date;
    role: RoleNamespace.Role;
    role_id_: string;
  }
}

using System.ComponentModel.DataAnnotations;

namespace AuthAPI_902.Dtos
{
    public class CreateRoleDto
    {
        [Required(ErrorMessage = "Role Name is required")]
        public string RoleName { get; set; } = null!;
    }
}

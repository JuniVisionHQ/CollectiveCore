using CollectiveCore.Api.DTOs;
using CollectiveCore.Api.Repositories;
using CollectiveCore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.Runtime.ConstrainedExecution;
using System.Security.Claims;

namespace CollectiveCore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // ========================================
        // LEGACY ENDPOINTS - ID-based lookup  
        // ========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            try
            {
                var users = await _userRepository.GetUsersAsync();

                var userDtos = users.Select(u => new UserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email
                });

                return Ok(userDtos);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var user = await _userRepository.GetUserAsync(id);

                if (user == null) return NotFound();

                return Ok(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email
                });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto newUserDto)
        {
            try
            {
                //this tests that fields are valid
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Add custom model validation error
                var userWithSameEmail = await _userRepository.GetUserByEmailAsync(newUserDto.Email);

                if (userWithSameEmail != null)
                {
                    ModelState.AddModelError("email", "User email already in use");
                    return BadRequest(ModelState);
                }

                var newUser = new User
                {
                    UserName = newUserDto.UserName,
                    Email = newUserDto.Email
                };

                var savedUser = await _userRepository.AddUserAsync(newUser);

                var userToReturn = new UserDto
                {
                    Id = savedUser.Id,
                    UserName = savedUser.UserName,
                    Email = savedUser.Email
                };

                return CreatedAtAction(nameof(GetUser), new { id = userToReturn.Id }, userToReturn);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error creating new user record");
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            try
            {                
                if (updateUserDto == null || id <= 0)
                {
                    return BadRequest("Invalid user update request.");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingUser = await _userRepository.GetUserAsync(id);
                if (existingUser == null)
                {
                    return NotFound($"User with Id = {id} not found");
                }

                // Map the fields from DTO to the existing user entity
                if (!string.IsNullOrWhiteSpace(updateUserDto.UserName))
                {
                    existingUser.UserName = updateUserDto.UserName;
                }

                if (!string.IsNullOrWhiteSpace(updateUserDto.Email))
                {
                    existingUser.Email = updateUserDto.Email;
                }

                var updatedUser = await _userRepository.UpdateUserAsync(existingUser);

                if (updatedUser == null)
                {
                    return NotFound($"User with Id = {id} could not be updated.");
                }

                var updatedUserDto = new UserDto
                {
                    Id = updatedUser.Id,
                    UserName = updatedUser.UserName,
                    Email = updatedUser.Email
                };

                return Ok(updatedUserDto);
            }
            catch (Exception)
            {
                // TODO: log exception here
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error updating data");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<UserDto>> DeleteUser(int id)
        {
            try
            {
                var userToDelete = await _userRepository.GetUserAsync(id);

                if (userToDelete == null)
                {
                    return NotFound($"User with Id = {id} not found");
                }

                var deletedUser = await _userRepository.DeleteUserAsync(id);

                if (deletedUser == null)
                {
                    return NotFound($"User with Id = {id} could not be deleted.");
                }

                // Map to DTO before returning
                var deletedUserDto = new UserDto
                {
                    Id = deletedUser.Id,
                    UserName = deletedUser.UserName,
                    Email = deletedUser.Email
                };

                return Ok(deletedUserDto);

            }
            catch (Exception)
            {
                // TODO: Log exception here
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error deleting data");
            }
        }

        // ========================================
        // AUTH0 ENDPOINTS - Current user (/me)
        // ========================================

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var auth0Email = User.FindFirst("https://collectivecore.com/email")?.Value;
            //var auth0Email = User.FindFirst(ClaimTypes.Email)?.Value;
            var auth0Name = User.FindFirst(ClaimTypes.Name)?.Value;

            //var auth0UserId = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(auth0UserId))
                return Unauthorized();

            var user = await _userRepository.GetUserByAuth0UserIdAsync(auth0UserId);

            if (user == null)
            {
                // Create a fallback name if Auth0 didn't provide one
                var finalName = !string.IsNullOrWhiteSpace(auth0Name)
                    ? auth0Name
                    : (auth0Email?.Split('@').FirstOrDefault() ?? "New User");

                // This is the "Add" part - lazy creation
                user = new User
                {
                    Auth0UserId = auth0UserId,
                    UserName = finalName,
                    Email = auth0Email ?? string.Empty
                };

                user = await _userRepository.AddUserAsync(user); // Creates new user
            }

            // This is the "Get" part - return the user data
            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email
            };

            return Ok(userDto);
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> UpdateCurrentUser(UpdateUserDto updateUserDto)
        {
            var auth0UserId = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(auth0UserId))
                return Unauthorized();

            var user = await _userRepository.GetUserByAuth0UserIdAsync(auth0UserId);
            if (user == null)
                return NotFound("User not found");

            if (!string.IsNullOrWhiteSpace(updateUserDto.UserName))
            {
                var existing = await _userRepository.GetUserByUserNameAsync(updateUserDto.UserName);
                if (existing != null && existing.Id != user.Id)
                {
                    return BadRequest("Username is already taken.");
                }
                user.UserName = updateUserDto.UserName;
            }

            if (!string.IsNullOrWhiteSpace(updateUserDto.Email))
                user.Email = updateUserDto.Email;

            var updatedUser = await _userRepository.UpdateUserAsync(user);
            if (updatedUser == null)
                return StatusCode(500, "Error updating user");

            var updatedUserDto = new UserDto
            {
                Id = updatedUser.Id,
                UserName = updatedUser.UserName,
                Email = updatedUser.Email
            };

            return Ok(updatedUserDto);
        }

    }
}

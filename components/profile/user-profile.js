import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
  // Redirect away if NOT auth
  const onChangePasswordHandler = async (passwordData) => {
    const response = await fetch("/api/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log("result", result);
  };
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={onChangePasswordHandler} />
    </section>
  );
}

export default UserProfile;

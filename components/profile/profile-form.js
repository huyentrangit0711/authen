import { useRef } from "react";
import classes from "./profile-form.module.css";
function ProfileForm(props) {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const onSubmitHandler = (event) => {
    event.preventDefault();
    props.onChangePassword({
      oldPassword: oldPasswordRef.current.value,
      newPassword: newPasswordRef.current.value,
    });
  };
  return (
    <form className={classes.form} onSubmit={onSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={oldPasswordRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={newPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;

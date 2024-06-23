import styles from "./styles.module.css";
import React from 'react';
import Ball from "./Ball";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>3D Ball Tracker</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>

			<div className={styles.three_d_ball_container}>
				<Ball />
			</div>

		</div>
	);
};

export default Main;

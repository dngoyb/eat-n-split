import { useState } from 'react';

const initialFriends = [
	{
		id: 118836,
		name: 'Clark',
		image: 'https://i.pravatar.cc/48?u=118836',
		balance: -7,
	},
	{
		id: 933372,
		name: 'Sarah',
		image: 'https://i.pravatar.cc/48?u=933372',
		balance: 20,
	},
	{
		id: 499476,
		name: 'Anthony',
		image: 'https://i.pravatar.cc/48?u=499476',
		balance: 0,
	},
];

function Button({ children, onClick }) {
	return (
		<button className='button' onClick={onClick}>
			{children}
		</button>
	);
}

export default function App({ onClick }) {
	const [friends, setFriends] = useState(initialFriends);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleShowAddFriend() {
		setShowAddFriend((show) => !showAddFriend);
	}

	function handleAddFriend(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	}

	function handleFriendSelection(friend) {
		setSelectedFriend((selected) =>
			selected?.id === friend.id ? null : friend
		);
	}

	return (
		<div className='app'>
			<div className='sidebar'>
				<FriendList
					friends={friends}
					onFriendSelection={handleFriendSelection}
					selectedFriend={selectedFriend}
				/>
				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? 'close' : 'Add friend'}
				</Button>
			</div>
			{selectedFriend && <FormSplitBill selectedFriend={selectedFriend} />}
		</div>
	);
}

function FriendList({ friends, onFriendSelection, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					key={friend.id}
					friend={friend}
					onFriendSelection={onFriendSelection}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, onFriendSelection, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;
	return (
		<li className={isSelected ? 'selected' : ''}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>

			{friend.balance < 0 && (
				<p className='red'>
					You owe {friend.name} ${Math.abs(friend.balance)}{' '}
				</p>
			)}
			{friend.balance > 0 && (
				<p className='green'>
					{friend.name} owes ${friend.balance}{' '}
				</p>
			)}
			{friend.balance === 0 && (
				<p className=''>You and {friend.name} are even </p>
			)}

			<Button onClick={() => onFriendSelection(friend)}>
				{isSelected ? 'Close' : 'Select'}
			</Button>
		</li>
	);
}

function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState('');
	const [image, setImage] = useState('https://i.pravatar.cc/48');

	function handleSubmit(e) {
		e.preventDefault();

		if (!name || !image) return;

		const id = crypto.randomUUID();
		const newFriend = {
			id,
			name,
			image: `${image}?=${id}`,
			balance: 0,
		};
		onAddFriend(newFriend);

		setImage('https://i.pravatar.cc/48');
		setName('');
	}
	return (
		<form className='form-add-friend' onSubmit={handleSubmit}>
			<label>👩🏽‍🤝‍👩🏽 Friend name</label>
			<input
				type='text'
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			<label>🖼 Image URL</label>
			<input
				type='text'
				value={image}
				onChange={(e) => setImage(e.target.value)}
			/>

			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend }) {
	return (
		<form className='form-split-bill'>
			<h2>Split a bill with {selectedFriend.name} </h2>

			<label>💰 Bill Value </label>
			<input type='text' />

			<label>🧍🏿‍♂️ Your expense </label>
			<input type='text' />

			<label>👩🏽‍🤝‍👩🏽 {selectedFriend.name}'s expense </label>
			<input type='text' disabled />

			<label>🤑 Who is paying the bill</label>
			<select>
				<option value='user'>You</option>
				<option value='friend'>{selectedFriend.name}</option>
			</select>

			<Button>Split bill</Button>
		</form>
	);
}

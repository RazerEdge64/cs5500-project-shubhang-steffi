import React from 'react';

/**
 * This method is used to represent the header of the application.
 * @param searchString  Represents the string in the input box.
 * @param setSearchString   Used to set the search string state to update the required views.
 * @returns {JSX.Element} Returns the header.
 * @constructor
 */
// function Header({searchString, setSearchString}) {
//     return (
//         <div className="header" id="header">
//             <div className="headerName">
//                 <h1>Fake Stack Overflow</h1>
//             </div>
//             <div className="searchContainer">
//                 <input
//                     type="text"
//                     id="searchBar"
//                     placeholder="Search..."
//                     value={searchString}
//                     onChange={e => {
//                         e.preventDefault();
//                         setSearchString(e.target.value);
//                     }}
//                 />
//             </div>
//         </div>
//     );
// }
//
// export default Header;

function Header({searchString, setSearchString, onSearchEnter}) {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearchEnter();
        }
    }

    return (
        <div className="header" id="header">
            <div className="headerName">
                <h1>Fake Stack Overflow</h1>
            </div>
            <div className="searchContainer">
                <input
                    type="text"
                    id="searchBar"
                    placeholder="Search..."
                    value={searchString}
                    onChange={e => {
                        e.preventDefault();
                        setSearchString(e.target.value);
                    }}
                    onKeyPress={handleKeyPress}
                />
            </div>
        </div>
    );
}
export default Header;

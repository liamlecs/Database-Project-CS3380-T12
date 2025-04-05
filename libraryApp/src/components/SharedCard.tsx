// // SharedCard.tsx
// import React from "react";
// import { Button } from "@mui/material";
// // import defaultItemImage from "../../assets/welcome_background.jpg";
// import defaultItemImage from "../assets/library-bg.jpg";

// interface SharedCardProps {
//   item: any;
//   category: string;
//   onCheckout: (item: any, category: string) => void;
//   isFavorite?: boolean;
//   toggleFavorite?: () => void;
//   darkMode?: boolean;
// }

// const getDisplayTitle = (item: any, category: string): string => {
//   if (!item) return "Untitled";
//   if (category === "Book") {
//     const title = item.title || "Untitled Book";
//     const author = item.author || "Unknown Author";
//     const genre = item.genre || "Unknown Genre";
//     return `${title}\n\nby ${author}\n\n(${genre})`;
//   }
//   if (category === "Movie") return item.title || item.director || "Untitled Movie";
//   if (category === "Music") return item.title || item.artist || "Untitled Song";
//   if (category === "Technology") return item.deviceType || item.title || "Untitled Device";
//   return item.title || "Untitled";
// };

// const SharedCard: React.FC<SharedCardProps> = ({
//   item,
//   category,
//   onCheckout,
//   isFavorite,
//   toggleFavorite,
//   darkMode,
// }) => {
//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "150px",
//         minHeight: "250px",
//         border: "1px solid #ccc",
//         padding: "0.75rem",
//         borderRadius: "10px",
//         backgroundColor: darkMode ? "#1e1e1e" : "#fafafa",
//         textAlign: "center",
//         boxShadow: darkMode ? "0 0 8px #000" : "0 2px 4px rgba(0,0,0,0.1)",
//         transition: "0.3s ease",
//       }}
//     >
//       {toggleFavorite && (
//         <span
//           onClick={toggleFavorite}
//           style={{
//             position: "absolute",
//             top: "10px",
//             right: "10px",
//             cursor: "pointer",
//             fontSize: "1.1rem",
//             color: isFavorite ? "red" : "#aaa",
//           }}
//           title="Favorite"
//         >
//           ❤️
//         </span>
//       )}

//       <img
//         src={item.coverImagePath ?? item.imageUrl ?? defaultItemImage}
//         alt={getDisplayTitle(item, category)}
//         style={{
//           width: "100px",
//           height: "130px",
//           objectFit: "cover",
//           borderRadius: "4px",
//           marginBottom: "0.5rem",
//         }}
//       />

//       {item.genre && (
//         <div
//           style={{
//             backgroundColor: "#ddd",
//             color: "#333",
//             fontSize: "0.6rem",
//             padding: "2px 6px",
//             borderRadius: "8px",
//             marginBottom: "0.3rem",
//             display: "inline-block",
//           }}
//         >
//           {item.genre}
//         </div>
//       )}

//       <h4
//         style={{
//           fontSize: "0.85rem",
//           margin: "0.25rem 0 0.5rem",
//           minHeight: "3rem",
//           whiteSpace: "pre-line",
//         }}
//       >
//         {getDisplayTitle(item, category)}
//       </h4>

//       <Button size="small" variant="contained" onClick={() => onCheckout(item, category)}>
//         Checkout
//       </Button>
//     </div>
//   );
// };

// export default SharedCard;

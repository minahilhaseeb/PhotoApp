# PhotoApp
## Extend user profile detail with usage
- When viewing the details of a user, the user detail page should include the following: 
- The most recently uploaded photo. There should be a small thumbnail image of the photo and the date it was uploaded. 
- The photo that has the most comments on it. There should be a small thumbnail of the photo and the comments count.
- Clicking on either of these images should switch the view to the photo’s detail view containing the photo and all its comments. (i.e., the photos view you have previously implemented). The exact view will depend on if you implemented a photo stepper or not.

## @mentions in comments
- The user should be able to @mention users in the comments of photos and be able to see all the photos that @mention a particular user. 
- Enhance the add comment support to allow @mentions of any existing user. In the comment text box there should be an intelligent way to select users (see hint).
- Users should not be able to @mention an invalid (non-existent) user, and an @mention for an invalid user should not crash the app.
- Extend the user detail view to show a list of all the photos that have comments that @mention the user, or display something reasonable if there are no @mentions.
- A small thumbnail of the photo. Clicking on the photo should link to the location of the photo on the user’s photo page
- The photo owner's name. Clicking on the owner’s name should link to the owner’s user detail page.

## Photo “like” votes
- Similar to Facebook’s like button, implement a like button for each photo to allow the user to like the photo. (Can be a button, icon, etc)
- Clicking on the like button makes the user like the photo (and visually changes the like button to an unlike button). Clicking the unlike button on a photo that has already been liked by the same user should unlike the photo.
- The number of likes of a photo should never be greater than the total number of users.
- If a user has already liked a photo, there should be some sort of visual indication on the page that the user has already liked the photo. This visual indication should be removed if the user unlikes the photo.
- Next to the like button, it should display the number of likes for that photo. This count should be updated (visually) immediately upon liking or unliking the photo.
- A user’s photos page should be sorted by the number of likes in descending order (most liked photos at the top). If photos have the same number of likes, sort by the  timestamp in reverse chronological order (most recent first). This doesn’t need to change immediately when a user likes / unlikes a photo - you are allowed to wait    until the page refreshes.

## Favorite list of photos for users
- A logged-in user should be able to favorite photos and have a user-specific list of favorites appear on a new page (path: /favorites). That page should be dedicated to showing a list of favorited photos of that user. Users should be able to remove favorited photos from that list.
- Users should be able to intuitively mark any photo as a favorite by clicking on a button appearing next to any photo shown on any user's list of photos. 
#### While a photo is favorited:
- the button to favorite that photo on a user's list of photos should be disabled
- there should be some clear indicator that this photo is currently favorited by the user
#### On a new view component, the user should be able to see a list of favorited photos, which must meet the following specifications:
- Each photo must be represented by a small thumbnail
- Clicking on the thumbnail should cause a modal window to open up displaying a larger version of the image (see hint below). It’s not sufficient to just have the click direct the user to a new page containing only that photo.
- The modal should also contain a caption consisting of the date associated with the image
- There should be an intuitive way to remove a photo (e.g., clicking the upper right x on a thumbnail) from the list so that it is not part of the user’s list of favorites any longer, even if the user refreshes the page and logs back in


## Tagging photos
#### The user shall be able to tag people in photos. Here is a rough sketch of the way this new feature should behave:
- Users can tag a photo by selecting a rectangular region of the photo and identifying the person in the selected region.
- The rectangle is selected by dragging the mouse across the photo.  As the user drags out the region the rectangle must stretch and shrink. The user must be able to drag in any direction, and the rectangle must remain visible after the drag is complete.
- If the user tries to extend the rectangle outside the range of the image, you must clip the rectangle to the boundaries of  the image.
- If the user doesn't like the rectangle selected, they can select another to replace it.
- Once the user has selected a region of the photo, they should be able to select a name from registered users of the system and tag the user. The tag can be submitted and recorded in the database.
- There can be multiple tags for a single photo, each with its own rectangle and user name.
- The application must provide a mechanism for displaying a photo with all of its tags: the rectangle for each tag should be displayed over the photo, and when the mouse hovers over the rectangle the first and last names of the tagged user should be displayed.
- Clicking on a user name should switch the view to the user detail view of the tagged user.


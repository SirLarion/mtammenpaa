CREATE TABLE showcase_items (
    id INTEGER PRIMARY KEY,
    path TEXT NOT NULL,
    img_urls TEXT NOT NULL,
    img_alt TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description BLOB NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
    showcase_items (
        path,
        img_urls,
        img_alt,
        display_name,
        description
    )
VALUES
    (
        'https://git.tammenpaa.com/sirlarion/sol-sim',
        'https://git.tammenpaa.com/sirlarion/sol-sim/media/branch/master/documentation/screenshots/main-small.webp',
        'An image of the ''sol-sim'' software. A user interface is displayed with a large, empty space. There are small, bright dots with circular trails depicting the large celestial bodies of our solar system.',
        'sol-sim',
        'Solar system simulator made as a course project. The software calculates the movements of celestial bodies with regard to each other and displays them in a human-readable way. The fun part is you can add new bodies and give them whatever mass you want, leading to slingshotting smaller bodies out of the solar system at near-lightspeed. It''s not a very accurate simulator.'
    );

INSERT INTO
    showcase_items (
        path,
        img_urls,
        img_alt,
        display_name,
        description
    )
VALUES
    (
        'https://git.tammenpaa.com/sirlarion/spaceballs',
        'https://git.tammenpaa.com/sirlarion/spaceballs/media/branch/master/aimball.webp',
        'An image of the ''Spaceballs'' game. A billiards cue ball is seen in the foreground. It levitates in a spherical space with holes on the inner surface of the sphere. A line indicating hit direction points out from the ball and collides with a pyramid-like cluster of other billiards balls. The line then deflects in another direction to display how the cue ball would move when colliding with the balls.',
        'Spaceballs',
        'Billiards in 3 dimensions. What an idea right? Spaceballs was another course project made with a group of people (accreditation in the Git repo, in Finnish only — Sorry!). You use your cue ball to knock the other balls in holes, but this time the holes are scattered on the inner-surface of a sphere, inside which you float and move around in. This was a very fun project and if I had All the Time in the World™ I''d definitely make this into a finalized product.'
    );

INSERT INTO
    showcase_items (
        path,
        img_urls,
        img_alt,
        display_name,
        description
    )
VALUES
    (
        'https://git.tammenpaa.com/sirlarion/sddm-haxor',
        'https://git.tammenpaa.com/sirlarion/sddm-haxor/media/branch/main/preview.webp',
        'A very barebones login screen is shown. An otherwise entirely black image has two lines of white text located on the left side of the image around the top-left golden ratio point.',
        'sddm-haxor',
        'A super barebones theme for the unix-based ''SDDM'' login manager. I was fed up with the wishy-washy default look of login screens and wanted something to show off what a CLI-wizard I am (can''t just use a regular TTY login screen of course because ... well, I dunno it was fun making this). Still using this to log in today.'
    );

INSERT INTO
    showcase_items (
        path,
        img_urls,
        img_alt,
        display_name,
        description
    )
VALUES
    (
        'https://git.tammenpaa.com/sirlarion/miniprojects/src/branch/main/libnet',
        'https://git.tammenpaa.com/sirlarion/miniprojects/media/branch/main/libnet/img/spring_layout.webp',
        'A network graph displayed in a spherical form. It looks almost like an explosion with warm colors changing to indicate the in-degree of each node.',
        'libnet',
        'A course project studying the network structure of Python dependencies in Github (as indicated by ''requirements.txt'' files). This was partially motivated by the left-pad incident a while back.'
    );

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function scrapeContentlyCoursesOnly() {
    try {
        const url = 'https://contently.com/contentlyu-content-marketing-courses/';
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        const courses = [];

        // getting the data only for the course section rest of is your homework
        const courseSection = $('#courses');

        // Extracting course information
        courseSection.find('.resource, .pr-wrapper').each((i, el) => {

            const title = $(el)
                .find('.r-title, .pr-title')
                .text()
                .replace(/\s+/g, ' ')
                .trim();

            const link = $(el).find('a.overlay-link').attr('href');

            // image extraction
            const imageStyle = $(el).find('.r-image').attr('style');
            let image = null;

            if (imageStyle) {
                const match = imageStyle.match(/url\(['"]?(.*?)['"]?\)/);
                image = match ? match[1] : null;
            }

            if (title && link) {
                courses.push({
                    title,
                    link,
                    image
                });
            }
        });

        console.log(courses);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

scrapeContentlyCoursesOnly();
import natural from 'natural';

const TfIdf = natural.TfIdf;


function buildDocument(listing) {
    const category = (listing.category || '').repeat(3);
    const condition = listing.condition || '';
    const title = listing.title || '';
    const description = listing.description || '';
    return `${title} ${title} ${description} ${category} ${condition}`;
}


function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    for (const [term, scoreA] of Object.entries(vecA)) {
        magA += scoreA * scoreA;
        if (vecB[term]) {
            dotProduct += scoreA * vecB[term];
        }
    }
    for (const score of Object.values(vecB)) {
        magB += score * score;
    }

    if (magA === 0 || magB === 0) return 0;
    return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}


function getVector(tfidf, docIndex) {
    const vector = {};
    tfidf.listTerms(docIndex).forEach(({ term, tfidf: score }) => {
        vector[term] = score;
    });
    return vector;
}

/**
 *
 * @param {string} targetId  - The listing the user is currently viewing
 * @param {Array}  listings  - All active listings from DB (exclude the target inside here)
 * @param {number} topN      - How many recommendations to return
 * @returns {Array}          - Sorted array of listings with _score attached
 */
export function getRecommendations(targetId, listings, topN = 6) {
    if (!listings || listings.length < 2) return [];

    const tfidf = new TfIdf();

    // Add all documents (including the target)
    listings.forEach(l => tfidf.addDocument(buildDocument(l)));

    // Find the index of our target listing
    const targetIndex = listings.findIndex(l => l.id === targetId);
    if (targetIndex === -1) return [];

    const targetVector = getVector(tfidf, targetIndex);

    // Compute cosine similarity for every other listing
    const scored = listings
        .map((listing, idx) => {
            if (idx === targetIndex) return null;
            // Also exclude listings from same owner
            if (listing.ownerId === listings[targetIndex].ownerId) return null;

            const candidateVector = getVector(tfidf, idx);
            const score = cosineSimilarity(targetVector, candidateVector);
            return { ...listing, _score: parseFloat(score.toFixed(4)) };
        })
        .filter(Boolean)
        .filter(l => l._score > 0)
        .sort((a, b) => b._score - a._score)
        .slice(0, topN);

    return scored;
}

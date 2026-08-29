import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashcardItem from '../../components/FlashcardItem';
// import FlashcardModal from '../../components/FlashcardModal';
// import ReviewControls from '../../components/ReviewControls';
import api from '../../services/api';



export default function Flashcards() {

    return (<div>
        <FlashcardItem/>
        {/* <ReviewControls></ReviewControls>
        <FlashcardModal></FlashcardModal> */}
    </div>
    );
}
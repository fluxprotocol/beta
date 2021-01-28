import circleCrypto from '../assets/images/circle-crypto.png';
import iconCrypto from '../assets/images/icons/icon-crypto.png';

import circleEsports from '../assets/images/circle-esports.png';
import iconEsports from '../assets/images/icons/icon-esports.png';

import circleMeme from '../assets/images/circle-meme.png';
import iconMeme from '../assets/images/icons/icon-meme.png';

import circlePolitics from '../assets/images/circle-politics.png';
import iconPolitics from '../assets/images/icons/icon-politics.png';

import circleSports from '../assets/images/circle-sports.png';
import iconSports from '../assets/images/icons/icon-sports.png';

import circleStartups from '../assets/images/circle-startups.png';
import iconStartups from '../assets/images/icons/icon-startups.png';

import circleStocks from '../assets/images/circle-stocks.png';
import iconStocks from '../assets/images/icons/icon-stockmarket.png';

import circleViral from '../assets/images/circle-viral.png';
import iconViral from '../assets/images/icons/icon-viral.png';

import circleBeer from '../assets/images/circle-beer.png';
import iconBeer from '../assets/images/icons/icon-beer.svg';

import { MarketCategory } from "../models/Market";
import trans from '../translation/trans';

interface CategoryInfo {
    icon: string;
    cardIcon: string;
    circleIcon: string;
    category: MarketCategory;
    title?: string;
    color: string;
}

export default function getCategoryInfo(category?: MarketCategory | string): CategoryInfo {
    switch (category) {
        case MarketCategory.Crypto:
            return {
                circleIcon: circleCrypto,
                category,
                cardIcon: '',
                icon: iconCrypto,
                title: trans('market.category.crypto'),
                color: '#5400FF',
            };
        case MarketCategory.Esports:
            return {
                circleIcon: circleEsports,
                category,
                cardIcon: '',
                icon: iconEsports,
                title: trans('market.category.esports'),
                color: '#4C6BF5',
            };
        case MarketCategory.Meme:
            return {
                circleIcon: circleMeme,
                category,
                cardIcon: '',
                icon: iconMeme,
                title: trans('market.category.meme'),
                color: '#FF00FD',
            };
        case MarketCategory.Politics:
            return {
                circleIcon: circlePolitics,
                category,
                cardIcon: '',
                icon: iconPolitics,
                title: trans('market.category.politics'),
                color: '#0004FF',
            };
        case MarketCategory.Sports:
            return {
                circleIcon: circleSports,
                category,
                cardIcon: '',
                icon: iconSports,
                title: trans('market.category.sports'),
                color: '#FF1958',
            };
        case MarketCategory.Startups:
            return {
                circleIcon: circleStartups,
                category,
                cardIcon: '',
                icon: iconStartups,
                title: trans('market.category.startups'),
                color: '#7400DA',
            };
        case MarketCategory.Stocks:
            return {
                circleIcon: circleStocks,
                category,
                cardIcon: '',
                icon: iconStocks,
                title: trans('market.category.stocks'),
                color: '#C45DFF',
            };
        case MarketCategory.Viral:
            return {
                circleIcon: circleViral,
                category,
                cardIcon: '',
                icon: iconViral,
                title: trans('market.category.viral'),
                color: '#FF009C',
            };
        case MarketCategory.Beer:
            return {
                circleIcon: circleViral,
                category,
                cardIcon: '',
                icon: iconBeer,
                title: trans('market.category.beer'),
                color: '#47A8BD',
            };
        default:
            return {
                circleIcon: circleStocks,
                category: MarketCategory.Unknown,
                cardIcon: '',
                icon: iconStocks,
                title: category,
                color: '#C45DFF',
            };
    }
}

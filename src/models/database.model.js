const { Schema, model } = require('mongoose');
const Joi = require('joi');

const databaseSchema = new Schema(
  {
    owner: String,
    tariffPlan: {
      type: String,
      enum: ['start', 'pro', 'max'],
      default: 'start',
    },
    questionAnswer: {
      start: {
        question: [String],
        answer: [String],
      },
      pro: {
        question: [String],
        answer: [String],
      },
      max: {
        question: [String],
        answer: [String],
      },
    },
    tags: [String],
    address: [String],
    hiBye: {
      salutation: {
        type: [String],
        default: [
          'Як я можу вам допомогти?',
          'Ласкаво просимо до нашого магазину.',
          'Вітаємо нового клієнта!',
          'Що нового сьогодні?',
          'Як справи?',
          'Готовий вам допомогти.',
          'Як пройшов день?',
          'Як я можу вам допомогти сьогодні?',
          'Як себе почуваєте?',
          'Ласкаво просимо до нашої спільноти.',
        ],
      },
      farewell: {
        type: [String],
        default: [
          'До зустрічі!',
          'Поки!',
          'До побачення!',
          'До скорої зустрічі!',
          'Всього найкращого!',
          'Бажаю гарного дня!',
          'Щасливо!',
          'До наступного разу!',
          'Майте чудовий день!',
          'Всього доброго!',
        ],
      },
    },
    defaultSalutation: {
      type: [String],
      default: [
        'Раді вітати Вас на нашому сайті. Що вас цікавить? Якщо виникли запитання, пишіть нам у чат. Ми завжди готові допомогти!',
      ],
    },
    pricefinder: { type: [String], default: ['ціна', 'вартість', 'купити'] },
    priceList: [
      {
        id: String,
        price: String,
        description: String,
        name: String,
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const createDatabaseSchema = Joi.object({
  tariffPlan: Joi.string().required(),
});

const Database = model('database', databaseSchema);

module.exports = {
  Database,
  createDatabaseSchema,
};

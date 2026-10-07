'use client';

import { Accordion, Content, Header, Item, Trigger } from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { WidgetDataType, useQuestions, widget } from '@sitecore-search/react';

const SEARCH_CONFIG = {
  source: process.env.NEXT_PUBLIC_SEARCH_SOURCE as string,
};

type Question = {
  question: string;
  answer: string;
};

const MainQuestionComponent = ({ answer, question }: Question) => {
  return (
    <div className="mb-6 border-b border-gray-200 p-3 dark:text-gray-100">
      <h4 className="text-lg font-bold">{question}</h4>
      <p className="mt-2">{answer}</p>
    </div>
  );
};

type RelatedQuestionsProps = {
  relatedQuestions: Array<Question>;
};

const RelatedQuestionsComponent = ({ relatedQuestions = [] }: RelatedQuestionsProps) => {
  return (
    <div className="space-y-4 dark:text-gray-100">
      {relatedQuestions.length > 0 && (
        <Accordion className="pb-4" type="multiple">
          <h4 className="text-md mb-4 font-bold">People also ask ...</h4>
          {relatedQuestions.map(({ answer, question }, index) => (
            <Item
              className="w-full cursor-pointer border-b border-gray-400 py-4 dark:border-b-gray-200"
              value={`${answer}-${index}`}
              key={index}
            >
              <Header>
                <Trigger className="text-bold flex w-full justify-between gap-x-2 text-left text-sm">
                  <span className="font-semibold">{question}</span>
                  <ChevronDownIcon height={20} width={20} />
                </Trigger>
              </Header>
              <Content className="pt-5 text-sm font-light">{answer}</Content>
            </Item>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export const QuestionsAnswersComponent = ({
  defaultKeyphrase = '',
  defaultRelatedQuestions = 5,
}) => {
  const {
    queryResult: {
      data: {
        related_questions: relatedQuestionsResponse = [],
        answer: { answer, question } = {
          answer: undefined,
          question: undefined,
        },
      } = {},
    },
  } = useQuestions({
    state: {
      keyphrase: defaultKeyphrase,
      relatedQuestions: defaultRelatedQuestions,
    },
    query: (query) => {
      if (SEARCH_CONFIG.source !== '') {
        const sources = SEARCH_CONFIG.source.split('|');
        sources.forEach((source) => {
          query.getRequest().addSource(source.trim());
        });
      }
    },
  });

  return (
    <div>
      {((answer && question) || relatedQuestionsResponse.length > 0) && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          {answer && question && <MainQuestionComponent answer={answer} question={question} />}
          {relatedQuestionsResponse.length > 0 && (
            <RelatedQuestionsComponent relatedQuestions={relatedQuestionsResponse} />
          )}
        </div>
      )}
    </div>
  );
};

const QuestionsAnswersWidget = widget(
  QuestionsAnswersComponent,
  WidgetDataType.QUESTIONS,
  'Articles'
);

export default QuestionsAnswersWidget;

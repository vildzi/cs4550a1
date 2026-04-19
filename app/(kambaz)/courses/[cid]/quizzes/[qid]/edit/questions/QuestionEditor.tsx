"use client";

import { useState } from "react";
import {
  Button,
  Col,
  Form,
  FormCheck,
  FormControl,
  FormLabel,
  FormSelect,
  InputGroup,
  Row,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { Question, QuestionType } from "../../../../../client";
import RichTextEditor from "../../../RichTextEditor";

type Props = {
  question: Question;
  onCancel: () => void;
  onSave: (updated: Question) => Promise<void> | void;
  onSaveAndPublish: (updated: Question) => Promise<void> | void;
};

export default function QuestionEditor({
  question,
  onCancel,
  onSave,
  onSaveAndPublish,
}: Props) {
  const [draft, setDraft] = useState<Question>(question);

  const updateField = <K extends keyof Question>(key: K, value: Question[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const changeType = (type: QuestionType) => {
    setDraft((d) => ({
      ...d,
      type,
      choices: type === "MULTIPLE_CHOICE" && d.choices.length === 0
        ? [
            { _id: uuidv4(), text: "", correct: true },
            { _id: uuidv4(), text: "", correct: false },
          ]
        : d.choices,
      blanks: type === "FILL_IN_BLANK" && d.blanks.length === 0 ? [""] : d.blanks,
    }));
  };

  const addChoice = () =>
    setDraft((d) => ({
      ...d,
      choices: [...d.choices, { _id: uuidv4(), text: "", correct: false }],
    }));

  const removeChoice = (id: string) =>
    setDraft((d) => ({
      ...d,
      choices: d.choices.filter((c) => c._id !== id),
    }));

  const updateChoice = (
    id: string,
    field: "text" | "correct",
    value: string | boolean
  ) =>
    setDraft((d) => ({
      ...d,
      choices: d.choices.map((c) =>
        c._id === id ? { ...c, [field]: value } : c
      ),
    }));

  const addBlank = () =>
    setDraft((d) => ({ ...d, blanks: [...d.blanks, ""] }));

  const removeBlank = (idx: number) =>
    setDraft((d) => ({
      ...d,
      blanks: d.blanks.filter((_, i) => i !== idx),
    }));

  const updateBlank = (idx: number, value: string) =>
    setDraft((d) => ({
      ...d,
      blanks: d.blanks.map((b, i) => (i === idx ? value : b)),
    }));

  return (
    <div className="border rounded p-3 mb-3 bg-white">
      <Row className="g-2 align-items-center mb-3">
        <Col md={5}>
          <FormControl
            placeholder="Question title"
            value={draft.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </Col>
        <Col md={4}>
          <FormSelect
            value={draft.type}
            onChange={(e) => changeType(e.target.value as QuestionType)}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="FILL_IN_BLANK">Fill in the Blank</option>
          </FormSelect>
        </Col>
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>pts</InputGroup.Text>
            <FormControl
              type="number"
              min={0}
              value={draft.points}
              onChange={(e) =>
                updateField("points", parseInt(e.target.value, 10) || 0)
              }
            />
          </InputGroup>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <FormLabel>Question</FormLabel>
        <RichTextEditor
          value={draft.questionHtml}
          onChange={(html) => updateField("questionHtml", html)}
        />
      </Form.Group>

      {draft.type === "MULTIPLE_CHOICE" && (
        <div className="mb-3">
          <FormLabel>Answers</FormLabel>
          <div className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
            Check the correct answer(s).
          </div>
          {draft.choices.map((choice) => (
            <Row key={choice._id} className="g-2 mb-2 align-items-center">
              <Col xs="auto">
                <FormCheck
                  type="checkbox"
                  checked={choice.correct}
                  onChange={(e) =>
                    updateChoice(choice._id, "correct", e.target.checked)
                  }
                />
              </Col>
              <Col>
                <FormControl
                  as="textarea"
                  rows={1}
                  placeholder="Answer text"
                  value={choice.text}
                  onChange={(e) =>
                    updateChoice(choice._id, "text", e.target.value)
                  }
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeChoice(choice._id)}
                >
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="outline-secondary" size="sm" onClick={addChoice}>
            + Add Another Answer
          </Button>
        </div>
      )}

      {draft.type === "TRUE_FALSE" && (
        <div className="mb-3">
          <FormLabel>Correct Answer</FormLabel>
          <div>
            <FormCheck
              type="radio"
              id={`tf-true-${draft._id}`}
              label="True"
              name={`tf-${draft._id}`}
              checked={draft.correctAnswer === true}
              onChange={() => updateField("correctAnswer", true)}
            />
            <FormCheck
              type="radio"
              id={`tf-false-${draft._id}`}
              label="False"
              name={`tf-${draft._id}`}
              checked={draft.correctAnswer === false}
              onChange={() => updateField("correctAnswer", false)}
            />
          </div>
        </div>
      )}

      {draft.type === "FILL_IN_BLANK" && (
        <div className="mb-3">
          <FormLabel>Possible Correct Answers</FormLabel>
          <div className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
            Any match will be graded as correct (case-insensitive).
          </div>
          {draft.blanks.map((blank, idx) => (
            <Row key={idx} className="g-2 mb-2 align-items-center">
              <Col>
                <FormControl
                  value={blank}
                  placeholder={`Possible answer #${idx + 1}`}
                  onChange={(e) => updateBlank(idx, e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeBlank(idx)}
                >
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          ))}
          <Button variant="outline-secondary" size="sm" onClick={addBlank}>
            + Add Another Answer
          </Button>
        </div>
      )}

      <hr />
      <div className="d-flex justify-content-end">
        <Button
          variant="secondary"
          size="sm"
          className="me-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          className="me-2"
          onClick={() => onSaveAndPublish(draft)}
        >
          Save & Publish
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onSave(draft)}
        >
          Update Question
        </Button>
      </div>
    </div>
  );
}
